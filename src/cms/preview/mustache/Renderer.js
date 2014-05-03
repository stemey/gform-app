define([
    'gform/util/Resolver',
    'dojo/_base/lang',
    "dojo/_base/declare",
    "dojo/Deferred",
    "../../util/visit",
    "gform/schema/meta",
    "dojo/when",
    "dojo/promise/all",
    "handlebars/handlebars"
], function (Resolver, lang, declare, Deferred, visit, metaHelper, when, all) {

    Handlebars.registerHelper('equals', function (a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('gt', function (a, b, options) {
        if (a > b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('gte', function (a, b, options) {
        if (a >= b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('link', function (url, options) {
        return "javascript:preview('" + url + "');";
    });


    return declare([ ], {
        pageStore: null,
        templateStore: null,
        resolver: null,
        templateToSchemaTransformer: null,
        handlePageRef: function (attribute, value, ctx, idx, templateKey) {
            if (!value.$ref) {
                return;
            }
            var me = this;
            if (attribute.usage === "link") {
                console.log("link " + idx);
                var p = this.pageStore.findByUrl(value.$ref);
                ctx.promises.push(p);
                when(p).then(function (page) {
                    ctx.page[idx] = page.url;
                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            } else if (attribute.usage === "partial") {
                console.log("getTemplateAndData " + idx);
                var p = this.getTemplateAndData(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    ctx.page[idx] = result.page;
                    ctx.templates[templateKey] = result.template.code;
                    Object.keys(result.templates).forEach(function (key) {
                        ctx.templates[key] = result.templates[key];
                    })
                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            }else if (attribute.usage === "data") {
                console.log("getData " + idx);
                var p = this.getData(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (data) {
                    ctx.page[idx] = data;

                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            } else {
                console.log("render pag-ref " + idx);
                var p = this.renderInternally(value.$ref);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    ctx.page[idx] = result;
                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            }
        },
        handleTemplateRef: function (attribute, value, goon, ctx) {
            if (attribute.outer) {
                ctx.outer = attribute;
            } else {
                ctx.templates[attribute.code] = attribute.template.code;
            }
            ctx.page[attribute.code] = value;
            if (value && attribute.template.partials && ctx.page[attribute.code]) {
                Object.keys(attribute.template.partials).forEach(function (key) {
                    var url = attribute.template.partials[key];
                    console.log("render partial of template-ref " + key);
                    var p = this.renderInternally(url, ctx.page);
                    ctx.promises.push(p);
                    when(p).then(function (html) {
                        ctx.page[key] = html;
                    }).otherwise(function (e) {
                            console.error("error during rendering " + e.stack);
                        });

                }, this);
            }
            if (attribute.template.partialTemplates) {
                Object.keys(attribute.template.partialTemplates).forEach(function (key) {
                    ctx.templates[key] = attribute.template.partialTemplates[key].code;
                });
            }
            ctx = {page: ctx.page[attribute.code], promises: ctx.promises, templates: ctx.templates};
            visit(this, attribute.template.group, ctx.page, ctx);
        },
        visit: function (attribute, value, goon, ctx) {
            var me = this;
            if (attribute.type == "ref" || attribute.type == "multi-ref") {
                this.handlePageRef(attribute, value, ctx, attribute.code, attribute.code);
            } else if (attribute.editor == "template-ref") {
                this.handleTemplateRef(attribute, value, goon, ctx);
            } else {
                if (metaHelper.isComplex(attribute)) {
                    ctx.page[attribute.code] = {};
                    if (attribute.type_code) {
                        ctx.page[attribute.code][type_code] = value[type_code];
                    }
                    ctx = {page: ctx.page[attribute.code], promises: ctx.promises, templates: ctx.templates};
                } else {
                    ctx.page[attribute.code] = value;
                }
                goon(ctx);
            }
        },
        visitElement: function (type, value, goon, idx, ctx) {
            if (type.type == "ref" || type.type == "multi-ref") {
                var p = this.handlePageRef(type, value, ctx, idx, ctx.arrayCode);
            } else {
                if (metaHelper.isComplex(type)) {
                    ctx.page[idx] = {};
                    if (type.type_code) {
                        ctx.page[idx][type_code] = value[type_code];
                    }
                    ctx = {page: ctx.page[idx], promises: ctx.promises, templates: ctx.templates};
                    goon(ctx);
                } else {
                    ctx.page[idx] = value;
                }

            }
        },
        visitArray: function (attribute, value, goon, ctx) {
            ctx.page[attribute.code] = [];
            ctx = {arrayCode: attribute.code, page: ctx.page[attribute.code], promises: ctx.promises, templates: ctx.templates};
            goon(ctx);
        },
        tmpls: {},
        renderIncludes: function (template, page) {
            // summary:
            //		finds all referenced pages in the template and renders them.
            // returns:
            //		a promise whose value is a new instance that is identical to page except that all references to pages are replace by their content.
            var me = this;
            var ctx = {page: {}, promises: [], templates: {}};
            var templatePromise = template;
            lang.mixin(ctx.page, page);
            console.log("renderIncludes p=" + page.url + "  t=" + template.name);
            if (this.templateToSchemaTransformer) {
                var cached = this.tmpls[template._id]
                if (cached) {
                    var resolved = cached;
                } else {
                    this.resolver = new Resolver();
                    var resolved = this.resolver.resolve(template, page.template);
                    this.tmpls[template._id] = resolved;
                }
                templatePromise = new Deferred();
                when(resolved).then(function (resolvedTemplate) {
                    var p = me.templateToSchemaTransformer.transform(resolvedTemplate, true);
                    when(p).then(function (resolvedTemplateX) {
                        templatePromise.resolve(resolvedTemplateX);
                    }).otherwise(function (e) {
                            console.error("error during rendering " + e.stack);
                        });
                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            }
            var includesPromise = new Deferred();
            var me = this;
            when(templatePromise).then(function (data) {
                visit(me, data, page, ctx);
                when(all(ctx.promises)).then(function () {
                    includesPromise.resolve(ctx);
                }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
            }).otherwise(function (e) {
                    console.error("error during rendering " + e.stack);
                });
            return includesPromise;
        },
        render: function (pageUrl, parentPage, checkPartial) {
            this.tmpls = {};
            this.pageCache = {};
            this.tadCache = {};
            this.resolver = new Resolver();
            return this.renderInternally(pageUrl, parentPage, checkPartial);
        },
        pageCache: {},
        renderInternally: function (pageUrl, parentPage, checkPartial) {
            //if (!parentPage) {
            //}
            var me = this;
            var renderPromise = new Deferred();

            var cached = this.pageCache[pageUrl];
            if (!parentPage) {
                if (cached) {
                    return cached;
                } else {
                    this.pageCache[pageUrl] = renderPromise;
                }
            }
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                when(me.templateStore.findByUrl(page.template)).then(function (template) {
                    console.log("renderInternally p=" + page.url + "  t=" + template.name);
                    if (!checkPartial || template.partial) {
                        var includesPromise = me.renderIncludes(template, page);
                        when(includesPromise).then(function (ctx) {
                            var partialPromises = [];
                            var newPage = ctx.page;
                            if (parentPage) {
                                newPage = {};
                                lang.mixin(newPage, parentPage);
                                lang.mixin(newPage, ctx.page);
                            }
                            var outerTemplate;
                            var partials = {};
                            lang.mixin(partials, template.partials);
                            if (template.outer) {
                                outerTemplate = template.outer;
                                lang.mixin(partials, outerTemplate.partials);
                                var octx = {page: {}, promises: [], templates: {}};
                                visit(me, outerTemplate.group, newPage, octx);
                                octx.promises.forEach(function (p) {
                                    partialPromises.push(p);
                                });

                            } else if (ctx.outer) {
                                outerTemplate = ctx.outer.template;

                            }
                            if (partials) {
                                Object.keys(partials).forEach(function (key) {
                                    var p = me.render(partials[key], newPage);
                                    partialPromises.push(p);
                                    when(p).then(function (html) {
                                        newPage[key] = html;
                                    }).otherwise(function (e) {
                                            console.error("error during rendering " + e.stack);
                                        });
                                });
                            }

                            if (template.partialTemplates) {
                                Object.keys(template.partialTemplates).forEach(function (key) {
                                    ctx.templates[key] = template.partialTemplates[key].code;
                                });
                            }
                            when(all(partialPromises)).then(function () {
                                if (outerTemplate) {
                                    ctx.templates["inner"] = template.code;
                                    if (ctx.outer) {
                                        var inner = newPage;
                                        newPage = ctx.page[ctx.outer.code];
                                        newPage.inner = inner;
                                    } else {
                                        newPage.inner = newPage;
                                    }
                                }
                                var sourceCode = outerTemplate ? outerTemplate.code : template.code;
                                var html = me.renderTemplate(sourceCode, newPage, ctx.templates);
                                renderPromise.resolve(html);
                            }).otherwise(function (e) {
                                    console.error("error during rendering " + e.stack);
                                });
                        }).otherwise(function (e) {
                                console.error("error during rendering " + e.stack);
                                alert("error during rendering " + e.stack);
                            });
                    } else {
                        renderPromise.resolve(page);
                    }
                }).otherwise(function (e) {
                        alert("error during rendering " + e.stack)
                    });
            }).otherwise(function (e) {
                    alert("error during rendering " + e.stack)
                });
            return renderPromise;

        },
        renderTemplate: function (code, ctx, partials) {
            Object.keys(partials).forEach(function (key) {
                Handlebars.registerPartial(key, partials[key]);
            });
            var template = Handlebars.compile(code);
            return template(ctx);
        },
        tadCache: {},
        getTemplateAndData: function (pageUrl) {
            var me = this;
            var renderPromise = new Deferred();
            var cached = this.tadCache[pageUrl];
            if (cached) {
                return cached;
            } else {
                this.tadCache[pageUrl] = renderPromise;
            }
            console.log(" get TemplateAndData " + pageUrl);
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                when(me.templateStore.findByUrl(page.template)).then(function (template) {
                    var includesPromise = me.renderIncludes(template, page);
                    when(includesPromise).then(function (ctx) {

                        renderPromise.resolve({template: template, page: ctx.page, templates: ctx.templates});
                    }).otherwise(function (e) {
                            console.error("error during rendering " + e.stack);
                        });
                }).otherwise(function (e) {
                        alert("error during rendering " + e.stack)
                    });
            }).otherwise(function (e) {
                    alert("error during rendering " + e.stack)
                });
            return renderPromise;
        },
        getData: function (pageUrl) {
            var me = this;
            var renderPromise = new Deferred();
            console.log("getData " + pageUrl);
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                renderPromise.resolve(page);
            }).otherwise(function (e) {
                alert("error during rendering " + e.stack)
            });
            return renderPromise;
        }
    })
})


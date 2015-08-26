define([
    'gform/list_primitive/QueryFactory',
    '../meta/Resolver',
    'dojo/_base/lang',
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "../util/visit",
    "gform/schema/meta",
    "dojo/when",
    "dojo/promise/all"
], function (QueryFactory, Resolver, lang, declare, Deferred, visit, metaHelper, when, all) {


    return declare([], {
        pageStore: null,
        templateStore: null,
        fileStore: null,
        resolver: null,
        templateToSchemaTransformer: null,
        urlProperty: null,
        needsToClonePage: true,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            if (kwArgs) {
                this.urlProperty = kwArgs.urlProperty || "url";
            }
            this.tmpls = {};
        },
        findByUrl: function (url) {

            var page = this.pageStore.findByUrl(url);
            if (this.needsToClonePage && page && typeof page.then !== "function") {
                // TODO also clone for promise and cache OR simply improve rendering code to not modify original page
                var clone = JSON.parse(JSON.stringify(page));
                return clone;
            } else {
                return page;
            }
        },
        handlePageRef: function (attribute, value, ctx, idx, templateKey) {
            if (!value) {
                return;
            }
            var me = this;
            if (attribute.usage === "link") {
                ////console.log("link " + idx);
                var p = this.findByUrl(value);
                ctx.promises.push(p);
                when(p).then(function (page) {
                    ctx.page[idx] = page[me.urlProperty];
                }).otherwise(function (e) {
                    ctx.errors.push({message: "error during getting link of " + value, error: e});
                });
            } else if (attribute.usage === "partial") {
                ////console.log("getTemplateAndData " + idx);
                var p = this.getTemplateAndData(value, ctx);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    if (result.errors) {
                        ctx.errors = ctx.errors.concat(result.errors);
                    } else {

                        ctx.page[idx] = result.page;
                        ctx.templates[templateKey] = result.template.sourceCode;
                        Object.keys(result.templates).forEach(function (key) {
                            ctx.templates[key] = result.templates[key];
                        })
                    }
                }).otherwise(function (e) {
                    ctx.errors.push({message: "error during getting template and data of " + value, error: e});
                });
            } else if (attribute.usage === "data") {
                ////console.log("getData " + idx);
                var p = this.getData(value);
                ctx.promises.push(p);
                when(p).then(function (data) {
                    if (data.errors) {
                        ctx.errors = ctx.errors.concat(data.errors);
                    } else {
                        ctx.page[idx] = data.page;
                    }

                }).otherwise(function (e) {
                    ctx.errors.push({message: "error while getting data for " + value, error: e});
                });
            } else if (attribute.usage === "html") {
                //console.log("render page ref " + idx);
                var p = this.renderInternally(value);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    ctx.page[idx] = result.html;
                    if (result.errors) {
                        ctx.errors = ctx.errors.concat(result.errors)
                    }
                }).otherwise(function (e) {
                    ctx.errors.push({message: "error during rendering of " + value, error: e});
                });
            } else {
                ctx.page[idx] = value;
            }
        },
        handleFileRef: function (attribute, value, goon, ctx) {
            if (!value) {
                return;
            }
            if (attribute.usage && attribute.usage !== "ref") {
                var p = this.fileStore.get(value);
                ctx.promises.push(p);
                when(p).then(function (data) {
                    ctx.page[attribute.code] = attribute.usage === "data" ? data : data.content;
                }).otherwise(function (e) {
                    ctx.errors.push({message: "error while getting file content for " + value, error: e});
                });
            } else {
                ctx.page[attribute.code] = value;
            }

        },
        handleMultiTemplateRef: function (attribute, value, goon, ctx) {
            if (!value) {
                return;
            }
            var templates = attribute.templates.filter(function (template) {
                return template[this.templateStore.idProperty] == value.__type__
            }, this);
            var groups = attribute.groups.filter(function (group) {
                return group.code == value.__type__
            });

            var ps = [];
            attribute.templates.forEach(function (t) {
                var id = t[this.templateStore.idProperty];
                var p = this.loadSourceCode(t);
                ps.push(p);
                p.then(function (result) {
                    ctx.templates[id] = result.sourceCode;
                })
            }, this)
            all(ps).then(function () {
                if (templates.length > 0) {
                    var template = templates[0];
                    var me = this;
                    p.then(function (loadedTemplate) {
                        me._handleTemplateRef(attribute, groups[0], loadedTemplate, value, goon, ctx);
                    }, function (e) {
                        ctx.errors.push(e);
                    });
                }
            }, function (e) {
                ctx.errors.push(e);
            })

        },
        handleTemplateRef: function (attribute, value, goon, ctx) {
            var p = this.loadSourceCode(attribute.template);
            ctx.promises.push(p);
            var me = this;
            p.then(function (template) {
                me._handleTemplateRef(attribute, attribute.group, template, value, goon, ctx);
            }, function (e) {
                ctx.errors.push(e);
            });
        },
        renderPartials: function (partials, ctx, page) {
            Object.keys(partials).forEach(function (key) {
                var url = partials[key];
                //console.log("render partial of template-ref " + key);
                //TODO configure hardcoded url
                ////console.log("getTemplateAndData " + idx);
                var p = this.getTemplateAndData(url, ctx);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    if (result.errors) {
                        ctx.errors = ctx.errors.concat(result.errors);
                    } else {
                        page[key] = result.page;
                        ctx.templates[key] = result.template.sourceCode;
                        Object.keys(result.templates).forEach(function (key2) {
                            ctx.templates[key2] = result.templates[key2];
                        })
                    }
                }).otherwise(function (e) {
                    ctx.errors.push({message: "error during getting template and data", error: e});
                });
                /* var p = this.renderInternally("/page/" + url, ctx.page);
                 ctx.promises.push(p);
                 when(p).then(function (result) {
                 ctx.page[attribute.code][key] = result.html;
                 if (result.errors) {
                 ctx.errors = ctx.errors.concat(result.errors);
                 }
                 }).otherwise(function (e) {
                 //console.error("error during rendering " + e.stack);
                 });*/

            }, this);
        },
        _handleTemplateRef: function (_attribute, group, template, value, goon, ctx) {
            if (!value) {
                return;
            }
            var me = this;
            //THIS is WRONG: only true for single template not multi template:
            var attribute = {};
            lang.mixin(attribute, _attribute);
            attribute.template = template;

            if (attribute.outer) {
                ctx.outer = attribute;
            } else {
                ctx.templates[attribute.code] = template.sourceCode;
            }
            ctx.page[attribute.code] = value;
            if (value && template && template.partials) {
                me.renderPartials(template.partials, ctx, ctx.page[attribute.code]);
            }

            if (template && template.partialTemplates) {
                Object.keys(template.partialTemplates).forEach(function (key) {
                    ctx.templates[key] = template.partialTemplates[key].sourceCode;
                });
            }
            var newCtx = {
                page: ctx.page[attribute.code],
                promises: ctx.promises,
                templates: ctx.templates,
                errors: ctx.errors,
                parent: ctx
            };
            visit(me, group, newCtx.page, newCtx);

        },
        visit: function (attribute, value, goon, ctx) {
            var me = this;
            if (attribute.code === "template") {
                // TODO make template property configurable
                // nothing
            } else if (attribute.editor === "query-ref") {
                this.handleQueryRef(attribute, value, ctx);
            } else if (attribute.editor === "file-ref") {
                this.handleFileRef(attribute, value, goon, ctx);
            } else if (attribute.template && attribute.group) {
                this.handleTemplateRef(attribute, value, goon, ctx);
            } else if (attribute.groups && attribute.templates) {
                this.handleMultiTemplateRef(attribute, value, goon, ctx);
            } else if (attribute.usage && (attribute.type == "ref" || attribute.type == "multi-ref")) {
                this.handlePageRef(attribute, value, ctx, attribute.code, attribute.code);
            } else {
                if (metaHelper.isComplex(attribute)) {
                    ctx.page[attribute.code] = {};
                    if (attribute.typeProperty) {
                        ctx.page[attribute.code][attribute.typeProperty] = value[attribute.typeProperty];
                    }
                    ctx = {
                        page: ctx.page[attribute.code],
                        promises: ctx.promises,
                        templates: ctx.templates,
                        errors: ctx.errors,
                        parent: ctx
                    };
                } else {
                    ctx.page[attribute.code] = value;
                }
                goon(ctx);
            }
        },
        handleQueryRef: function (attribute, value, ctx) {
            function createCtx(ctx) {
                return {
                    getValue: function () {
                        return ctx.page;
                    },
                    getParent: function () {
                        return ctx.parent != null ? createCtx(ctx.parent) : null;
                    }
                }
            }

            var qf = new QueryFactory({attribute: attribute, ctx: createCtx(ctx)});
            var query = qf.create();
            var p = when(this.pageStore.query(query, {sort: attribute.sort}));
            p.then(function (results) {
                ctx.page[attribute.code] = results;
            }).otherwise(function (e) {
                ctx.errors.push({message: e.message, error: e});
            });
            ctx.promises.push(p);
        },
        visitElement: function (type, value, goon, idx, ctx) {
            if (type.type == "ref" || type.type == "multi-ref") {
                var p = this.handlePageRef(type, value, ctx, idx, ctx.arrayCode);
            } else {
                if (metaHelper.isComplex(type)) {
                    ctx.page[idx] = {};
                    if (type.type_code) {
                        ctx.page[idx][type.type_code] = value[type.type_code];
                    }
                    ctx = {
                        page: ctx.page[idx],
                        promises: ctx.promises,
                        templates: ctx.templates,
                        errors: ctx.errors,
                        parent: ctx
                    };
                    goon(ctx);
                } else {
                    ctx.page[idx] = value;
                }

            }
        },
        visitArray: function (attribute, value, goon, ctx) {
            ctx.page[attribute.code] = [];
            ctx = {
                arrayCode: attribute.code,
                page: ctx.page[attribute.code],
                promises: ctx.promises,
                templates: ctx.templates,
                errors: ctx.errors,
                parent: ctx
            };
            if (attribute.template) {
                // TODO we don't support partials and partialTemplates for array
                ctx.templates[attribute.code] = attribute.template.sourceCode;
            }
            if (attribute.templates) {
                //this._renderMultiRefTemplateArray(attribute, value, ctx);
                attribute.templates.forEach(function (template) {
                    var p = this.loadSourceCode(template);
                    var id = template[this.templateStore.idProperty]
                    p.then(function (result) {
                        ctx.templates[id] = result.sourceCode;
                    })
                    ctx.promises.push(p);

                }, this)
            }
            goon(ctx);

        },
        tmpls: null,
        renderIncludes: function (template, page) {
            // summary:
            //		finds all referenced pages in the template and renders them.
            // returns:
            //		a promise whose value is a new instance that is identical to page except that all references to pages are replace by their content.
            var me = this;
            var ctx = {page: {}, promises: [], templates: {}, errors: []};
            var templatePromise = template;
            lang.mixin(ctx.page, page);
            console.log("renderIncludes p=" + page.url + "  t=" + template.name);
            if (this.templateToSchemaTransformer) {
                var id = this.templateStore.getIdentity(template);
                var cached = this.tmpls[id];
                if (cached) {
                    var resolved = cached;
                } else {
                    this.resolver = new Resolver();
                    this.resolver.baseUrl = this.templateStore.target;
                    var resolved = this.resolver.resolve(template, "http://localhost:8080/schema/" + page[this.pageStore.typeProperty]);
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
            var error = function (ctx) {
                renderPromise.resolve({message: "error during rendering of " + pageUrl, errors: ctx.errors}
                );
            }

            when(me.findByUrl(pageUrl)).then(function (page) {
                var templateId = page[me.pageStore.typeProperty];
                if (templateId) {
                    // TODO replace findByUrl by getById
                    when(me.loadTemplate(templateId)).then(function (template) {
                        me._renderPage(page, template, parentPage, checkPartial, renderPromise, error);
                    }).otherwise(error);
                } else {
                    renderPromise.resolve({noPage: true});
                }
            }).otherwise(error);

            return renderPromise;

        },
        loadTemplate: function (id) {
            var p = new Deferred();
            var me = this;
            // TODO don't modify loaded objects
            when(this.templateStore.get(id)).then(function (result) {
                me.loadSourceCode(result).then(function (r) {
                    p.resolve(r)
                }).otherwise(function (e) {
                    p.reject(e);
                }).otherwise(function (e) {
                    p.reject(e);
                })
            }).otherwise(function (e) {
                p.reject(e);
            })
            return p.promise;
        },
        loadSourceCode: function (result) {
            var p = new Deferred();
            var me = this;
            if (!result.sourceCode) {
                p.resolve(result);
            } else if (typeof result.sourceCode === "string") {
                p.resolve(result);
            } else if (result.sourceCode.sourceCodeOrigin === "inline") {
                var template = {};
                lang.mixin(template, result);
                template.sourceCode = result.sourceCode.sourceCode;
                p.resolve(template);
            } else {
                when(me.fileStore.get(result.sourceCode.sourceRef)).then(function (file) {
                    var template = {};
                    lang.mixin(template, result);
                    template.sourceCode = file.content;
                    p.resolve(template);
                }).otherwise(function (e) {
                    p.reject(e);
                })
            }
            return p.promise;
        },
        _renderPage: function (page, template, parentPage, checkPartial, renderPromise, error) {
            var me = this;
            //console.log("renderInternally p=" + page.url + "  t=" + template.name);
            if (!template.sourceCode) {
                renderPromise.resolve({noPage: true});
                return;
            }
            if (!checkPartial || template.partial) {
                var includesPromise = me.renderIncludes(template, page);
                when(includesPromise).then(function (ctx) {
                    //var partialPromises = [];
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
                            ctx.promises.push(p);
                        });

                    } else if (ctx.outer) {
                        outerTemplate = ctx.outer[me.pageStore.typeProperty];

                    }
                    if (partials) {
                        me.renderPartials(partials, ctx, newPage);

                    }


                    if (template.files) {
                        me.loadFiles(template.files, ctx, newPage);
                    }

                    if (template.partialTemplates) {
                        Object.keys(template.partialTemplates).forEach(function (key) {
                            ctx.templates[key] = template.partialTemplates[key].sourceCode;
                        });
                    }
                    when(all(ctx.promises)).then(function () {
                        if (outerTemplate) {
                            ctx.templates["inner"] = template.sourceCode;
                            if (ctx.outer) {
                                var inner = newPage;
                                newPage = ctx.page[ctx.outer.code];
                                newPage.inner = inner;
                                delete inner[ctx.outer.code]
                            } else {
                                newPage.inner = newPage;
                            }
                        }
                        var sourceCode = outerTemplate ? outerTemplate.sourceCode : template.sourceCode;
                        var html = me.renderTemplate(sourceCode, newPage, ctx.templates);
                        renderPromise.resolve({html: html, errors: ctx.errors});
                    }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                        ctx.errors.push({message: e.message, error: e});
                        error(ctx);
                    });
                }).otherwise(function (e) {
                    console.error("error during rendering " + e.stack);
                    //alert("error during rendering " + e.stack);
                });
            } else {
                renderPromise.resolve(page);
            }

        },
        loadFiles: function (files, ctx, page) {
            if (files) {
                Object.keys(files).forEach(function (key) {
                    var promise = when(this.fileStore.get(files[key]));
                    promise.then(function (result) {
                        page[key] = result;
                    })
                    ctx.promises.push(promise);
                }, this)
            }
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
            ////console.log(" get TemplateAndData " + pageUrl);
            when(me.findByUrl(pageUrl)).then(function (page) {
                // TODO replace findByUrl by getById
                when(me.loadTemplate(page.template)).then(function (template) {
                    var includesPromise = me.renderIncludes(template, page);
                    when(includesPromise).then(function (ctx) {

                        renderPromise.resolve({template: template, page: ctx.page, templates: ctx.templates});
                    }).otherwise(function (e) {
                        console.error("error during rendering " + e.stack);
                    });
                }).otherwise(function (e) {
                    var errors = [
                        {message: "error during rendering ", error: e}
                    ];
                    renderPromise.resolve({template: {}, page: {}, templates: {}, errors: errors});

                });
            }).otherwise(function (e) {
                var errors = [
                    {message: "error during rendering ", error: e}
                ];
                renderPromise.resolve({template: {}, page: {}, templates: {}, errors: errors});
            });
            return renderPromise;
        },
        getData: function (pageUrl) {
            var me = this;
            var renderPromise = new Deferred();
            //console.log("getData " + pageUrl);
            // TODO replace findByUrl by getById
            when(me.findByUrl("/page/" + pageUrl)).then(function (page) {
                renderPromise.resolve({page: page});
            }).otherwise(function (e) {
                var errors = [
                    {message: "error during rendering ", error: e}
                ];
                renderPromise.resolve({errors: errors});
            });
            return renderPromise;
        }
    })
})


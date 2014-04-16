define([
    "dojo/_base/declare",
    "dojo/Deferred",
    "../../util/visit",
    "gform/schema/meta",
    "dojo/when",
    "dojo/promise/all",
    "mustache/mustache"
], function (declare, Deferred, visit, metaHelper, when, all, mustache) {


    return declare([ ], {
        renderer: mustache,
        pageStore: null,
        templateStore: null,
        templateToSchemaTransformer: null,
        handlePageRef: function (attribute, value, ctx, idx, templateKey) {
            if (!value.$ref) {
                return;
            }
            var me = this;
            if (attribute.usage === "link") {
                var p = this.pageStore.findByUrl(value.$ref);
                ctx.promises.push(p);
                when(p).then(function (page) {
                    ctx.page[idx] = page.url;
                });
            } else if (attribute.usage === "partial") {
                var p = this.getTemplateAndData(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    ctx.page[idx] = result.page;
                    ctx.templates[templateKey] = result.template.code;
                })
            } else {
                var p = this.render(value.$ref);
                //var p = this.getTemplateAndData(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (result) {
                    ctx.page[idx] = result;
                })
            }
        },
        visit: function (attribute, value, goon, ctx) {
            if (attribute.type == "ref" || attribute.type == "multi-ref") {
                this.handlePageRef(attribute, value, ctx, attribute.code, attribute.code);
            } else if (attribute.editor == "template-ref") {
                ctx.page[attribute.code] = value;
                ctx.templates[attribute.code] = attribute.template.code;
                ctx = {page: ctx.page[attribute.code], promises: ctx.promises, templates: ctx.templates};
                visit(this, attribute.template.group, ctx.page, ctx);
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
        renderIncludes: function (template, page) {
            // summary:
            //		finds all referenced pages in the template and renders them.
            // returns:
            //		a promise whose value is a new instance that is identical to page except that all references to pages are replace by their content.
            var ctx = {page: {}, promises: [], templates: {}};
            if (this.templateToSchemaTransformer) {
                template = this.templateToSchemaTransformer.transform(template);
            }
            var includesPromise = new Deferred();
            var me = this;
            when(template).then(function (template) {
                visit(me, template, page, ctx);
                when(all(ctx.promises)).then(function () {
                    includesPromise.resolve(ctx);
                });
            })
            return includesPromise;
        },
        render: function (pageUrl, checkPartial) {
            var me = this;
            var renderPromise = new Deferred();
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                when(me.templateStore.findByUrl(page.template)).then(function (template) {
                    if (!checkPartial || template.partial) {
                        var includesPromise = me.renderIncludes(template, page);
                        when(includesPromise).then(function (ctx) {
                            var partialPromises = [];
                            if (template.partials) {
                                Object.keys(template.partials).forEach(function (key) {
                                    //var p = me.render(template.partials[key].$ref);
                                    var p = me.render(template.partials[key]);
                                    partialPromises.push(p);
                                    when(p).then(function (html) {
                                        ctx.page[key] = html;
                                    });
                                });
                            }
                            when(all(partialPromises)).then(function () {
                                var html = me.renderer.render(template.code, ctx.page, ctx.templates);
                                renderPromise.resolve(html);
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
                ;
            }).otherwise(function (e) {
                    alert("error during rendering " + e.stack)
                });
            ;
            return renderPromise;

        },
        getTemplateAndData: function (pageUrl) {
            var me = this;
            var renderPromise = new Deferred();
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                when(me.templateStore.findByUrl(page.template)).then(function (template) {
                    var includesPromise = me.renderIncludes(template, page);
                    when(includesPromise).then(function (ctx) {

                        renderPromise.resolve({template: template, page: ctx.page, templates: ctx.templates});
                    })
                }).otherwise(function (e) {
                        alert("error during rendering " + e.stack)
                    });
            }).otherwise(function (e) {
                    alert("error during rendering " + e.stack)
                });
            return renderPromise;
        }
    })
})


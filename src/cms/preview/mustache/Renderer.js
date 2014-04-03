define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/json",
    "dojo/Deferred",
    "../../util/visit",
    "gform/schema/meta",
    "dojo/when",
    "dojo/promise/all",
    "mustache/mustache"
], function (declare, lang, json, Deferred, visit, metaHelper, when, all, mustache) {


    return declare([ ], {
        renderer: mustache,
        pageStore: null,
        templateStore: null,
        visit: function (attribute, value, goon, ctx) {
            if (attribute.type == "ref" || attribute.type == "multi-ref") {
                var p = this.render(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (html) {
                    ctx.page[attribute.code] = html;
                })
            } else {
                if (metaHelper.isComplex(attribute)) {
                    ctx.page[attribute.code] = {};
                    if (attribute.type_code) {
                        ctx.page[attribute.code][type_code] = value[type_code];
                    }
                    ctx = {page: ctx.page[attribute.code], promises: ctx.promises};
                } else {
                    ctx.page[attribute.code] = value;
                }
                goon(ctx);
            }
        },
        visitElement: function (type, value, goon, idx, ctx) {
            if (type.type == "ref" || type.type == "multi-ref") {
                var p = this.render(value.$ref, true);
                ctx.promises.push(p);
                when(p).then(function (html) {
                    ctx.page[idx] = html;
                })
            } else {
                ctx.page[idx] = value;

            }
        },
        visitArray: function (attribute, value, goon, ctx) {
            ctx.page[attribute.code] = [];
            ctx = {page: ctx.page[attribute.code], promises: ctx.promises};
            goon(ctx);
        },
        renderIncludes: function (template, page) {
            // summary:
            //		finds all referenced pages in the template and renders them.
            // returns:
            //		a promise whose value is a new instance that is identical to page except that all references to pages are replace by their content.
            var ctx = {page: {}, promises: []};
            visit(this, template, page, ctx);
            var includesPromise = new Deferred();
            when(all(ctx.promises)).then(function () {
                includesPromise.resolve(ctx.page);
            });
            return includesPromise;
        },
        render: function (pageUrl, checkPartial) {
            var me = this;
            var renderPromise = new Deferred();
            when(me.pageStore.findByUrl(pageUrl)).then(function (page) {
                    when(me.templateStore.findByUrl(page.template)).then(function (template) {
                        if (!checkPartial || template.partial) {
                            var includesPromise = me.renderIncludes(template, page);
                            when(includesPromise).then(function (page) {
                                var html = me.renderer.render(template.code, page);
                                renderPromise.resolve(html);
                            });
                        } else {
                            renderPromise.resolve(page);
                        }
                    });
            });
            return renderPromise;

        }
    });


});

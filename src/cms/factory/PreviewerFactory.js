define([
    'dojo/_base/lang',
    'dojo/aspect',
    '../meta/TemplateSchemaTransformer',
    '../controller/Previewer',
    'dijit/layout/ContentPane',
    "dojo/_base/declare",
    '../controller/CacheStore'
], function (lang, aspect, TemplateSchemaTransformer, Previewer, ContentPane, declare, CacheStore) {


    return declare([], {
        create: function (ctx, config) {

            var pageStore = new CacheStore(ctx.getStore(config.pageStore));
            var templateStore = ctx.getStore(pageStore.store.templateStore);

            var previewer = new Previewer({pageStore: pageStore});
            aspect.after(pageStore, "onUpdate", lang.hitch(previewer, "refresh"));
            require([config.rendererClass], function (Renderer) {
                var createRenderer = function () {
                    var renderer = new Renderer(config);
                    renderer.templateStore = templateStore;
                    renderer.pageStore = pageStore;
                    var templateToSchemaTransformer = new TemplateSchemaTransformer(templateStore);
                    renderer.templateToSchemaTransformer = templateToSchemaTransformer;
                    return renderer;
                }
                previewer.createRenderer = createRenderer;
            });


            var pane = new ContentPane();
            pane.addChild(previewer);
            return pane;

        }
    });


});
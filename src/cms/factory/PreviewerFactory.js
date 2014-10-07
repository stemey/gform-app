define([
    '../meta/TemplateSchemaTransformer',
    '../controller/Previewer',
    'dijit/layout/ContentPane',
    "dojo/_base/declare"
], function (TemplateSchemaTransformer, Previewer, ContentPane, declare) {


    return declare([], {
        create: function (ctx, config) {

            var pageStore = ctx.getStore("/page");
            var templateStore = ctx.getStore("/template");

            var previewer = new Previewer({pageStore:pageStore});
            require([config.rendererClass], function(Renderer) {
                var renderer=new Renderer(config);
                renderer.templateStore = templateStore;
                renderer.pageStore = pageStore;
                var templateToSchemaTransformer = new TemplateSchemaTransformer(templateStore);
                renderer.templateToSchemaTransformer = templateToSchemaTransformer;
                previewer.renderer= renderer;
            });


            var pane =new ContentPane();
            pane.addChild(previewer);
            return pane;

        }
    });


});
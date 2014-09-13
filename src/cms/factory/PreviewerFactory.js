define([
    '../preview/mustache/Renderer',
    '../meta/TemplateSchemaTransformer',
    '../controller/Previewer',
    'dijit/layout/ContentPane',
    "dojo/_base/declare"
], function (Renderer, TemplateSchemaTransformer, Previewer, ContentPane, declare) {


    return declare([], {
        create: function (ctx, config) {

            var pageStore = ctx.getStore("/page");
            var templateStore = ctx.getStore("/template");

            var previewer = new Previewer();
            previewer.pageStore=pageStore;
            var renderer = new Renderer();
            renderer.templateStore = templateStore;
            renderer.pageStore = pageStore;

            previewer.renderer= renderer;

            var templateToSchemaTransformer = new TemplateSchemaTransformer(templateStore);
            renderer.templateToSchemaTransformer = templateToSchemaTransformer;

            var pane =new ContentPane();
            pane.addChild(previewer);
            return pane;

        }
    });


});
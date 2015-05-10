define([
	'./load',
	'./ContainerFactory',
	'dojo/_base/lang',
	'dojo/aspect',
	'../meta/TemplateSchemaTransformer',
	'../controller/Previewer',
	'dijit/layout/ContentPane',
	"dojo/_base/declare",
	'../controller/CacheStore'
], function (load, ContainerFactory, lang, aspect, TemplateSchemaTransformer, Previewer, ContentPane, declare, CacheStore) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {

			return load([config.rendererClass], function (Renderer) {
				var pageStore = new CacheStore(ctx.getStore(config.pageStore));
				var templateStore = ctx.getStore(pageStore.store.templateStore);

				var previewer = new Previewer({pageStore: pageStore});
				aspect.after(pageStore, "onUpdate", lang.hitch(previewer, "refresh"));
				var createRenderer = function () {
					var renderer = new Renderer(config);
					renderer.templateStore = templateStore;
					renderer.pageStore = pageStore;
					var templateToSchemaTransformer = new TemplateSchemaTransformer(templateStore);
					renderer.templateToSchemaTransformer = templateToSchemaTransformer;
					return renderer;
				}
				previewer.createRenderer = createRenderer;


				var pane = new ContentPane({previewerId: config.previewerId});
				pane.onEntityFocus = lang.hitch(previewer, "onEntityFocus");
				pane.onEntityUpdated = lang.hitch(previewer, "onEntityUpdated");
				pane.onEntityNavigate = lang.hitch(previewer, "onEntityNavigate");
				pane.onEntityRefresh = lang.hitch(previewer, "onEntityRefresh");
				pane.addChild(previewer);
				return pane;
			});
		}
	});


});
define([
    'dojo/_base/lang',
    './load',
	'./ContainerFactory',
	'../meta/TemplateSchemaTransformer',
	'../controller/Previewer',
	"dojo/_base/declare",
	'../controller/CacheStore'
], function (lang, load, ContainerFactory, TemplateSchemaTransformer, Previewer, declare, CacheStore) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {

			return load([config.rendererClass], function (Renderer) {
                // TODO we should use a different CacheStores
				var pageStore = new CacheStore(ctx.getStore(config.pageStore));
                var fileStore = new CacheStore(ctx.getStore(config.fileStore));
                var templateStore = ctx.getStore(pageStore.store.templateStore);

				var previewer = new Previewer({pageStore: pageStore, urlProperty:config.urlProperty||"url"});
				//aspect.after(pageStore, "onUpdate", lang.hitch(previewer, "refresh"));
				var createRenderer = function () {
                    var props= {};
                    lang.mixin(props,config);
                    props.templateStore = templateStore;
                    props.pageStore = pageStore;
                    props.fileStore = fileStore;
                    var templateToSchemaTransformer = new TemplateSchemaTransformer({ctx:ctx,store:templateStore});
                    props.templateToSchemaTransformer = templateToSchemaTransformer;

					var renderer = new Renderer(props);
					return renderer;
				}
				previewer.createRenderer = createRenderer;
				previewer.previewerId=config.previewerId;

				return previewer;
			});
		}
	});


});

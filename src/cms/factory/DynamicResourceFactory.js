define([
	'dojo/promise/all',
	'./dynamic/DynamicResourceManager',
	'dojo/Deferred',
	"dojo/_base/declare",
	'dojo/promise/all'
], function (all, DynamicResourceManager,Deferred, declare, all) {


	return declare([], {

		create: function (ctx, config) {
			var mainDeferred = new Deferred();
			require([
				config.storeClass, config.createEditorFactory], function ( Store, createEditorFactory) {
				// contains the information about store and its schemas
				var metaStore = ctx.getStore(config.storeId);
				var rm = new DynamicResourceManager({
					ctx: ctx,
					config: config,
					createEditorFactory: createEditorFactory,
					StoreClass: Store
				})

				metaStore.query({}).then(function (metas) {
					var deferreds = [];
					metas.forEach(function (meta) {
						var deferred = rm.addMeta(meta);
						deferreds.push(deferred);
						all(deferreds).then(function () {
							mainDeferred.resolve("done");
						});
					})

				}).otherwise(function (e) {
					console.error("cannot load meta data ", e);
					mainDeferred.reject(e);
				});
			});
			return mainDeferred;
		}
	});
});

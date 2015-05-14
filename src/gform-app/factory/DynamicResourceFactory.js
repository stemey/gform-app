define([
	'./dynamic/DynamicResourceManager',
	'dojo/Deferred',
	"dojo/_base/declare",
	'../dynamicstore/SchemaTransformer'
], function (DynamicResourceManager, Deferred, declare, SchemaTransformer) {


	return declare([], {

		create: function (ctx, config) {
			var mainDeferred = new Deferred();
			require([config.createEditorFactory], function (createEditorFactory) {
				// contains the information about store and its schemas
				var metaStore = ctx.getStore(config.storeId);
				var schemaTransformer = new SchemaTransformer({ctx: ctx, idProperty: config.idProperty});
				var rm = new DynamicResourceManager({
					ctx: ctx,
					config: config,
					createEditorFactory: createEditorFactory,
					schemaTransformer: schemaTransformer
				});
				var promise = rm.load();
				promise.then(function () {
					mainDeferred.resolve("done");
				}).otherwise(mainDeferred.reject);

			});
			return mainDeferred;
		}
	});
});

define([
	'dojo/_base/lang',
	'../loadAll',
	'../load',
	"dojo/_base/declare"
], function (lang, loadAll, load, declare) {

	/**
	 * store to store our schemas.
	 * schema that provide a meta schema for the store.
	 *
	 */

	return declare([], {
		create: function (ctx, config) {
			var me = this;
			return load([config.registryClass], function (registryClass) {
				var registry = new registryClass();
				if (config.stores) {
					config.stores.forEach(function (storeConfig) {
						var store = ctx.getStore(storeConfig.id);
                        var props = {store: store, ctx: ctx};
                        lang.mixin(props, storeConfig);
                        if (storeConfig.storeClass) {
                            var schemaStore = new storeConfig.storeClass(props);
                        }else {
                            schemaStore=store;
                        }
						registry.registerStore(storeConfig.id, schemaStore);
					});
				}
				return loadAll(registry, config.schemaGenerators, function (schema) {
					registry.register(schema.id, schema);
				}, ctx);


			});
		}
	});


});

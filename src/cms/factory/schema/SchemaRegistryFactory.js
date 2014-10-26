define([
    './SchemaStore',
    '../loadAll',
    '../../meta/TemplateSchemaTransformer',
    '../load',
    "dojo/_base/declare"
], function (SchemaStore, loadAll, TemplateSchemaTransformer, load, declare) {

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
                config.stores.forEach(function (storeId) {
                    var store = ctx.getStore(storeId);
                    var transformer = new TemplateSchemaTransformer(store);
                    var schemaStore = new SchemaStore({store: store, transformer: transformer});
                    registry.registerStore(storeId, schemaStore);
                });
                return loadAll(registry, config.schemaGenerators, function (schema) {
                    registry.register(schema.id, schema);
                }, ctx);


            });
        }
    });


});

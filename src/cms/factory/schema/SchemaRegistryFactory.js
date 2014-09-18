define([
    '../../meta/TemplateSchemaTransformer',
    '../load',
    "dojo/_base/declare"
], function (TemplateSchemaTransformer, load, declare) {


    return declare([], {
        create: function (ctx, config) {
            return load([config.registryClass], function (registryClass) {
                var store = ctx.getStore(config.storeId);
                var registry = new registryClass();
                registry.registerStore(config.storeId, store);

                var templateToSchemaTransformer = new TemplateSchemaTransformer(store);
                registry.pageTransformer = templateToSchemaTransformer
                registry.templateTransformer =templateToSchemaTransformer;


                return registry;
            });
        }
    });


});

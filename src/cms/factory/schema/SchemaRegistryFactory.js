define([
    'dojo/_base/lang',
    'dojo/when',
    'cms/meta/SchemaGenerator',
    '../../meta/TemplateSchemaTransformer',
    '../load',
    "dojo/_base/declare",
    "dojo/text!cms/schema/template.json"
], function (lang, when, SchemaGenerator, TemplateSchemaTransformer, load, declare, templateSchema) {


    return declare([], {
        create: function (ctx, config) {
            var me =this;
            return load([config.registryClass], function (registryClass) {
                var store = ctx.getStore(config.storeId);
                var registry = new registryClass();
                registry.registerStore(config.storeId, store);

                var templateToSchemaTransformer = new TemplateSchemaTransformer(store);
                registry.pageTransformer = templateToSchemaTransformer
                registry.templateTransformer =templateToSchemaTransformer;
                me.loadTemplateSchema(registry);

                return registry;
            });
        },
        loadTemplateSchema: function (registry) {
            var generator = new SchemaGenerator();
            var promise = generator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", registry));
        },
        onTemplateSchemaLoaded: function (registry, meta) {
            meta.store = "/schema";
            // get attributes of root.listpane
            var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = JSON.parse(templateSchema)
            var idAttribute = {};
            idAttribute["type"] = "string";//this.configuration.templateStore.idType;
            idAttribute["code"] = "code";//this.configuration.templateStore.idProperty;
            baseSchema.groups[0].attributes.push(idAttribute);

            var group = meta.attributes[0];
            group.requiredAttributes = true;
            baseSchema.groups[3].attributes.push(group);


            registry.register("/template", baseSchema);
        }
    });


});

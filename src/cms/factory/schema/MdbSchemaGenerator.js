define([
    'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    'cms/meta/SchemaGenerator',
    "dojo/_base/declare",
    "dojo/text!cms/schema/mdbschema.json"
], function (Deferred, lang, when, SchemaGenerator, declare, mdbschema) {

    /**
     * store to store our schemas.
     * schema that provide a meta schema for the store.
     *
     */

    return declare([], {
        deferred: null,
        create: function (ctx, config) {
            var store = ctx.getStore(config.store);
            //var templateToSchemaTransformer = new TemplateSchemaTransformer(store);
            //registry.pageTransformer = templateToSchemaTransformer
            //registry.templateTransformer = templateToSchemaTransformer;
            this.loadTemplateSchema(store, config);
            this.deferred = new Deferred();
            return this.deferred;

        },
        loadTemplateSchema: function (store, config) {
            var generator = new SchemaGenerator();
            var promise = generator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store, config));
        },
        onTemplateSchemaLoaded: function (store,  config, meta) {
            //meta.store = "/schema";
            // get attributes of root.listpane
            //var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = JSON.parse(mdbschema)
            var idAttribute = {};

            // adding the schema store's id attribute
            idAttribute["type"] = store.idType || "string";
            idAttribute["code"] = store.idProperty;
            idAttribute["disabled"] = true;
            baseSchema.groups[0].attributes.push(idAttribute);
			baseSchema.id = config.schemaId || store.name;

            var group = meta.attributes[0];
            //group.requiredAttributes = true;
            baseSchema.groups[1].attributes.push(group);
            this.deferred.resolve(baseSchema);
        }
    });


});

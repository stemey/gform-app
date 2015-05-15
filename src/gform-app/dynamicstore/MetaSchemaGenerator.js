define([
    '../../dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/text!../schema/metaSchemaTemplate.json"
], function (Deferred, lang, when, declare, metaSchemaTemplate) {

    /**
     * store to store our schemas.
     * schema that provide a meta schema for the store.
     *
     */

    return declare([], {
        deferred: null,
		schemaGenerator:null,
        create: function (ctx, config) {
            var store = ctx.getStore(config.store);
			this.schemaGenerator = config.schemaGenerator;
            //var templateToSchemaTransformer = new TemplateSchemaTransformer(store);
            //registry.pageTransformer = templateToSchemaTransformer
            //registry.templateTransformer = templateToSchemaTransformer;
			this.deferred = new Deferred();
            this.loadTemplateSchema(store, config);
            return this.deferred;

        },
        loadTemplateSchema: function (store, config) {
            var promise = this.schemaGenerator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store, config));
        },
        onTemplateSchemaLoaded: function (store,  config, meta) {
            //meta.store = "/schema";
            // get attributes of root.listpane
            //var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = JSON.parse(metaSchemaTemplate)
            var idAttribute = {};

            // adding the schema store's id attribute
            idAttribute["type"] = store.idType || "string";
            idAttribute["code"] = store.idProperty;
            baseSchema.groups[0].attributes.push(idAttribute);
			baseSchema.id = config.schemaId || store.name;

            var group = meta.attributes[0];
            //group.requiredAttributes = true;
            baseSchema.groups[1].attributes.push(group);
            this.deferred.resolve(baseSchema);
        }
    });


});
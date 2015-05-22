define([
    'gform/util/Resolver',
    'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/text!../../schema/template.json"
], function (Resolver, Deferred, lang, when,  declare, templateSchema) {

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
            this.loadTemplateSchema(store);
            this.deferred = new Deferred();
            this.requiredAttribute=config.requiredAttribute;
            return this.deferred;

        },
        loadTemplateSchema: function (store) {
            var promise = this.schemaGenerator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store));
        },
        onTemplateSchemaLoaded: function (store,  meta) {
            meta.store = "/schema";
            // get attributes of root.listpane
            //var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = JSON.parse(templateSchema)
            new Resolver({values:{pageStore:"page"}}).resolve(baseSchema,null);
            var idAttribute = {};

            // adding the schema store's id attribute
            idAttribute["type"] = store.idType || "string";
            idAttribute["code"] = store.idProperty;
            idAttribute["disabled"] = true;
            baseSchema.groups[0].attributes.push(idAttribute);

            var group = meta.attributes[0];
            if (this.requiredAttribute) {
                group.requiredAttributes = [{code: this.requiredAttribute}];
            }
            baseSchema.groups[3].attributes.push(group);
            this.deferred.resolve(baseSchema);
        }
    });


});

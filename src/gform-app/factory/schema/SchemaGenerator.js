define([
	'../../meta/SchemaGenerator',
	'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/text!../../schema/template.json"
], function (SchemaGenerator, Deferred, lang, when,  declare, templateSchema) {

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
            this.loadTemplateSchema(store);
            this.deferred = new Deferred();
            return this.deferred;

        },
        loadTemplateSchema: function (store) {
            var generator = new SchemaGenerator();
            var promise = generator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store));
        },
        onTemplateSchemaLoaded: function (store,  meta) {
            meta.store = "/schema";
            // get attributes of root.listpane
            //var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = JSON.parse(templateSchema)
            var idAttribute = {};

            // adding the schema store's id attribute
            idAttribute["type"] = store.idType || "string";
            idAttribute["code"] = store.idProperty;
            idAttribute["disabled"] = true;
            baseSchema.groups[0].attributes.push(idAttribute);

            var group = meta.attributes[0];
            group.requiredAttributes = [{code:'url'}];
            baseSchema.groups[3].attributes.push(group);
            this.deferred.resolve(baseSchema);
        }
    });


});

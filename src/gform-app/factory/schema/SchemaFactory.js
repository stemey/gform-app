define([
    'gform/schema/SchemaGenerator',
    'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/text!../../schema/template.json"
], function (SchemaGenerator, Deferred, lang, when, declare, templateSchema) {

    /**
     * store to store our schemas.
     * schema that provide a meta schema for the store.
     *
     */

    return declare([], {
        deferred: null,
        schemaGenerator: null,
        create: function (ctx, config) {
            var store = ctx.getStore(config.store);
            var partialStore = ctx.getStore(config.partialStore);
            var instanceStore = ctx.getStore(store.instanceStore);
            this.schemaGenerator = new SchemaGenerator();
            this.deferred = new Deferred();
            this.requiredAttribute = config.requiredAttribute;
            var t = this.schemaGenerator.createTransformer();
            t.replace("gform/schema/attributes.json", "gform-app/example/cms/attributes.json");
            t.replace("gform/schema/attributes/header.json", "gform-app/meta/header.json");
            t.replace("gform/schema/group/properties/attribute.json", "gform-app/meta/group-attribute.json");
            t.replace("gform/schema/group/properties/attributes.json", "gform-app/meta/group-attributes.json");
            t.replace("gform/schema/attributes/properties/group.json", "gform-app/meta/group.json");
            t.replace("gform/schema/attributes/properties/groups.json", "gform-app/meta/groups.json");
            t.replace("gform/schema/group.json", "gform-app/factory/schema/group.json");

            var baseSchema = JSON.parse(templateSchema)


            var values = {
                pageStore: instanceStore.name,
                pageIdProperty: instanceStore.idProperty,
                idProperty: store.idProperty,
                idType: store.idType || "string",
                idRequired: store.assignableId,
                idDisabled: !store.assignableId,
                templateStore: store.name,

                partialStore: partialStore.name,
                partialSchema: partialStore.template,

                templateSchema: store.template,
                pageSearchProperty: config.pageSearchProperty || "name",
                pageTypeProperty: instanceStore.typeProperty
            }

            var promise = this.schemaGenerator.load(baseSchema, "gform/schema/", t, values);
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store));
            return this.deferred;
        },
        onTemplateSchemaLoaded: function (store, meta) {

            this.deferred.resolve(meta);
        }
    });


});

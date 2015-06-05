define([
    'gform/schema/SchemaGenerator',
    "dojo/_base/declare",
    "dojo/text!./schemaTemplate.json"
], function (SchemaGenerator, declare, schemaTemplate) {

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


			this.schemaGenerator = new SchemaGenerator();

            var t = this.schemaGenerator.createTransformer();
            t.replace("gform/schema/attributes.json","gform-app/mongodb/attributes.json");
            t.replace("gform/schema/attributes/header.json","gform-app/meta/header.json");
            t.replace("gform/schema/group/properties/attribute.json","gform-app/meta/group-attribute.json");
            t.replace("gform/schema/group/properties/attributes.json","gform-app/meta/group-attributes.json");
            t.replace("gform/schema/attributes/properties/group.json","gform-app/meta/group.json");
            t.replace("gform/schema/attributes/properties/groups.json","gform-app/meta/groups.json");

            var baseSchema = JSON.parse(schemaTemplate)


            var values = {
                idProperty: store.idProperty,
                idType: store.idType || "string",
                idRequired: store.assignableId,
                idDisabled: !store.assignableId,
                schemaId:config.schemaId
            }

            var promise = this.schemaGenerator.load(baseSchema, "gform/schema/", t, values);
            return promise;


        }
    });


});

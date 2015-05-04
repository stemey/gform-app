
define([
    'gform/schema/SchemaGenerator',
    'dojo/_base/declare',
    'dojo/text!../meta/group.json'
], function (SchemaGenerator,  declare, group) {
// module:
//		gform/util/Resolver


    return declare("cms.SchemaGenerator", [SchemaGenerator], {
        loadTemplateSchema: function () {
            var t = this.createTransformer();
            t.replace("gform/schema/attributes.json","gform-app/mongodb/attributes.json");
            t.replace("gform/schema/attributes/header.json","gform-app/meta/header.json");
            t.replace("gform/schema/group/properties/attribute.json","gform-app/meta/group-attribute.json");
            t.replace("gform/schema/group/properties/attributes.json","gform-app/meta/group-attributes.json");
            t.replace("gform/schema/attributes/properties/group.json","gform-app/meta/group.json");
			t.replace("gform/schema/attributes/properties/groups.json","gform-app/meta/groups.json");
			var base = JSON.parse(group)
            return this.load({attributes:[base]}, "gform/schema/", t);
        }

    })
});


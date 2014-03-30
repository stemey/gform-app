
define([
    'gform/schema/SchemaGenerator',
    'dojo/_base/declare',
    'dojo/text!gform/schema/group.json'
], function (SchemaGenerator,  declare, group) {
// module:
//		gform/util/Resolver


    return declare("cms.SchemaGenerator", [SchemaGenerator], {
        loadTemplateSchema: function () {
            var t = this.createTransformer();
            t.replace("gform/schema/attributes.json","cms/meta/attributes.json");
            return this.load(JSON.parse(group), "gform/schema/", t);
        }

    })
});


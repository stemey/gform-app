
define([
    'gform/schema/transform',
    'dojo/_base/declare',
    './Resolver',
    'dojo/text!gform/schema/group.json'
], function (transform, declare, Resolver, group) {
// module:
//		gform/util/Resolver


    return declare("cms.SchemaGenerator", [], {
        load: function () {
            var resolver = new Resolver({baseUrl: "./gform/schema/", transformations: transform});
            return resolver.resolve(JSON.parse(group));
        }

    })
});


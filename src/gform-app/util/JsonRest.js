define([
    './FindByUrlMixin',
    "dojo/_base/declare",
    "dojo/store/JsonRest"
], function (FindByUrlMixin, declare, JsonRest) {
// module:
//		gform/controller/SchemaRegistry


    return declare([JsonRest, FindByUrlMixin], {
        // summary:
        //		A registry for stores. Makes it easy to reuse and mock stores.
       query: function(query,options) {
           for (var key in query) {
               if (query[key].$in) {
                   query[key]=query[key].$in;
               }
           }
           return this.inherited(arguments);
       },
        getChildren: function (parent) {
            var parentUrl = parent ? parent.url : "";
            var results = this.query({parent: parent.id});
            return results;
        },
        getLabel: function (item) {
            return item.name;
        },
        mayHaveChildren: function (item) {
            return item.folder;
        }
    });


});

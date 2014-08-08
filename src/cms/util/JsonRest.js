define([
    'dojo/when',
    'dojo/topic',
    './FindByUrlMixin',
    "dojo/_base/declare",
    "dojo/store/JsonRest"
], function (when, topic, FindByUrlMixin, declare, JsonRest) {
// module:
//		gform/controller/SchemaRegistry


    return declare([JsonRest, FindByUrlMixin], {
        // summary:
        //		A registry for stores. Makes it easy to reuse and mock stores.

        add: function(item) {
            var result= this.inherited(arguments);
            when(result).then(function(){topic.publish("/page/added",{url:item.url})});
            return result;
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

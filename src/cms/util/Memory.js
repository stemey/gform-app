define([
    'gform/util/restHelper',
    "dojo/_base/declare",
    "gform/store/GeneratingIdMemory"
], function (restHelper, declare, Memory) {
// module:
//		gform/controller/SchemaRegistry


    return declare([Memory], {
        // summary:
        //		A registry for stores. Makes it easy to reuse and mock stores.

        add: function (value, options) {
            if (value[this.idProperty || "id"] == null) {
                delete value[this.idProperty || "id"];
            }
            return this.inherited(arguments);
        },
        findByUrl: function (url) {
            var id = restHelper.decompose(url).id;
            return this.get(id);
        }

    });
});

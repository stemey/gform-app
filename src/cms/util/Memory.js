define([
    './FindByUrlMixin',
    "dojo/_base/declare",
    "gform/store/GeneratingIdMemory"
], function (FindByUrlMixin, declare, Memory) {
// module:
//		gform/controller/SchemaRegistry


    return declare([Memory, FindByUrlMixin], {
        // summary:
        //		A registry for stores. Makes it easy to reuse and mock stores.

        add: function (value, options) {
            if (value[this.idProperty || "id"] == null) {
                delete value[this.idProperty || "id"];
            }
            return this.inherited(arguments);
        }

    });
});

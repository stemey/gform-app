define([
    './FindByUrlMixin',
    "dojo/_base/declare",
    "gform/store/GeneratingIdMemory"
], function (FindByUrlMixin, declare, Memory) {


    return declare([Memory, FindByUrlMixin], {
        add: function (value, options) {
            if (value[this.idProperty || "id"] == null) {
                delete value[this.idProperty || "id"];
            }
            return this.inherited(arguments);
        }

    });
});

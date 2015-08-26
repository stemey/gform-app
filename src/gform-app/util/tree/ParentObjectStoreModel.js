define([
    './AbstractParentObjectStoreModel',
    "dojo/_base/declare"
], function (AbstractParentObjectStoreModel, declare) {

    return declare([AbstractParentObjectStoreModel], {
        constructor: function () {
            this.query = {};
            this.query[this.store.parentProperty] = null;
        },
        getParentId: function (obj) {
            return obj ? obj[this.store.parentProperty] : null;
        },
        mayHaveChildren: function (object) {
            var type = this.getType(object);
            return  type.match(/(f|F)older/);
        }
    });

});

define([
    './AbstractParentObjectStoreModel',
    "dojo/_base/declare"
], function (AbstractParentObjectStoreModel, declare) {

    return declare([AbstractParentObjectStoreModel], {
        constructor: function () {
            this.query = {};
            this.query[this.store.parentProperty] = null;
        },
        getVisibleAncestorId: function (entity) {
            var parentId = this.getParentId(entity);
            return this.childrenCache[parentId];
        },
        getParentId: function (obj) {
            return obj ? obj[this.store.parentProperty] : null;
        },
        mayHaveChildren: function (object) {
            var type = this.getType(object);
            return type.match(/(f|F)older/);
        }
    });

});

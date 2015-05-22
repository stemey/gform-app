define([
    'dojo/when',
    'dijit/tree/ObjectStoreModel',
    "dojo/_base/declare"
], function (when, ObjectStoreModel, declare) {

    return declare([ObjectStoreModel], {
        constructor: function () {
            this.query = {};
            this.query[this.store.parentProperty] = null;
        },
        _getParentId: function (obj) {
            return obj[this.store.parentProperty];
        },
        getLabel: function (item) {
            return item.name;
        },
        _getType: function (obj) {
            return obj[this.store.typeProperty];
        },
        mayHaveChildren: function (object) {
            return this._getType(object).match(/(f|F)older/);
        },
        createEntity: function (entity) {
            var me = this;
            var parentId = this._getParentId(entity);
            var parent = this.childrenCache[parentId]
            if (parent) {
                when(this.store.getChildren({id: parentId}), function (result) {
                    me.onChildrenChange({id: parentId}, result);
                })
            }
        }
        ,
        updateEntity: function (entity, oldEntity) {
            if (entity.parent !== this._getParentId(oldEntity)) {
                this.deleteEntity(this.store.getIdentity(oldEntity));
                this.createEntity(entity);
            } else {
                this.onChange(entity);
            }
        },
        deleteEntity: function (id) {
            this.onDelete({id: id});
        }
    });

});

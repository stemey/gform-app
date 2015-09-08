define([
    'dojo/when',
    'dijit/tree/ObjectStoreModel',
    "dojo/_base/declare"
], function (when, ObjectStoreModel, declare) {

    return declare([ObjectStoreModel], {
        getLabel: function (item) {
            return item.name;
        },
        getType: function (obj) {
            return obj[this.store.typeProperty];
        },
        createEntity: function (entity) {
            var me = this;
            var parentId = this.getParentId(entity);
            var parent = this.childrenCache[parentId]
            if (parent) {
                var item = {};
                item[this.store.idProperty]=parentId;
                when(this.store.getChildren(item), function (result) {
                    me.onChildrenChange(item, result);
                })
            }
        },
        updateEntity: function (entity, oldEntity) {
            if (oldEntity && entity.parent !== this.getParentId(oldEntity)) {
                this.deleteEntity(this.store.getIdentity(oldEntity));
                this.createEntity(entity);
            } else {
                this.onChange(entity);
            }
        },
        deleteEntity: function (id) {
            var item = {};
            item[this.store.idProperty]=id;
            this.onDelete(item);
        }
    });

});

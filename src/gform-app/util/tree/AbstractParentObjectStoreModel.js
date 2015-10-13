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
            var parent = this.getVisibleAncestor(entity);
            var item = {};
            //item[this.store.idProperty]=parent[this.store.idProperty];
            when(me.store.getChildren(parent), function (result) {
                me.onChildrenChange(parent, result);
            })
        },
        updateEntity: function (entity, oldEntity) {
            // TODO should we only check parent??
            if (oldEntity && entity.path !== oldEntity.path) {
                this.deleteEntity(this.store.getIdentity(oldEntity));
                this.createEntity(entity);
            } else {
                this.onChange(entity);
            }
        },
        deleteEntity: function (id) {
            var item = {};
            item[this.store.idProperty] = id;
            this.onDelete(item);
        }
    });

});

define([
    './AbstractParentObjectStoreModel',
    "dojo/_base/declare"
], function (AbstractParentObjectStoreModel, declare) {

    return declare([AbstractParentObjectStoreModel], {
        mayHaveChildren: function (object) {
            // TODO fix this ambiguity
            return object.type == "dir" || object[this.store.typeProperty] == this.store.folderType;
        },
        getVisibleAncestor: function (entity) {
            var parentPath = entity.parent;
            var parent=null;
            while (!parent && parentPath.length > 0) {
                if (this.childrenCache[parentPath]) {
                    parent ={};
                    parent[this.store.idProperty]=parentPath;
                } else {
                    var idx = parentPath.lastIndexOf("/");
                    if (idx > 0) {
                        parentPath = parentPath.substring(0, idx);
                    } else {
                        parent = this.root;
                        parentPath = "";
                    }
                }
            }
            return parent;
        },
        getParentId: function (obj) {
            var id = this.store.getIdentity(obj);
            var idx = id.lastIndexOf("/");
            if (idx < 0) {
                return "";
            } else {
                return id.substr(0, idx);
            }
        }

    });

});

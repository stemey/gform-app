define([
    'dojo/when',
    'dijit/tree/ObjectStoreModel',
    "dojo/_base/declare"
], function (when, ObjectStoreModel, declare) {

    return declare([ObjectStoreModel], {
        store: null,
        basePath: "/pages",
        getLabel: function (item) {
            return item.name;
        },
        mayHaveChildren: function (object) {
            return object.folder;
        },
        getUnloadedParents: function (parents) {
            // ["","/test","/test/tt"]
            var me = this;
            var unloadedParents = [];
            if (parents.length > 1) {
                for (var i = 1; i <= parents.length - 1; i++) {
                    var current = this.basePath + parents[i];
                    var parent = this.basePath + parents[i - 1];
                    if (i == parents.length - 1 || this.childrenCache[current] == null) {
                        unloadedParents.push(parent);
                    }
                };
            }
            unloadedParents.push(this.basePath + parents[parents.length - 1]);


            return unloadedParents;
        },
        loadChildren: function (parents) {
            var unloadedParents = this.getUnloadedParents(parents);
            this.doload(unloadedParents);
        },
        doload: function (paths) {
            var me = this;
            if (paths.length > 0) {
                // check if immediate parent is loaded

                var path = paths[0];
                when(this.store.getChildren({id: path}), function (result) {
                    me.onChildrenChange({id: path}, result);
                    me.doload(paths.slice(1))
                });
            }
        },
        createEntity: function (url) {
            var parents = this.getParents(url);
            this.loadChildren(parents);
        },
        updateEntity: function (entity, oldEntity) {
            var name = entity.url.match(/[^/]+$/)[0];
            var oldName = oldEntity.url.match(/[^/]+$/)[0];
            var path = entity.url.substring(0,entity.url.length-name.length);
            var oldPath= oldEntity.url.substring(0,oldEntity.url.length-oldName.length);
            if (path!=oldPath) {
                this.deleteEntity(oldEntity.identifier);
                this.createEntity(entity.url);
            } else {
                this.onChange({id: entity.identifier, name: name, template: entity.template, folder: false});
            }
        },
        getParent: function (entity) {
            var url = entity.url;
            var parents = this.getParents(url);
            var parent = this.basePath + parents[parents.length - 1];
            if (this.childrenCache[parent] != null) {
                var found = this.childrenCache[parent].filter(function (item) {
                    return item.id = entity.id;
                });
                return found.length > 0;
            } else {
                return null;
            }
        },
        deleteEntity: function (id) {
            this.onDelete({id: id});
        },
        getParents: function (url) {
            var parents = [""];
            var parts = url.split("/");
            var c = "";
            if (parts.length > 2) {
                for (var i = 1; i < parts.length - 1; i++) {
                    c += "/" + parts[i];
                    parents.push(c);
                }
            }
            return parents;
        }

    });

});

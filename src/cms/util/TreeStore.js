define([
    'dojo/when',
    'dijit/tree/ObjectStoreModel',
    "dojo/_base/declare"
], function (when, ObjectStoreModel, declare) {

    return declare([ObjectStoreModel], {
        store: null,
        getLabel: function (item) {
            return item.name;
        },
        mayHaveChildren: function (object) {
            return object.folder;
        },
        loadChildren: function(parents) {
            var me = this;
            if (parents.length>0) {
                var parent = parents[0];
                if(parents.length==1 || this.childrenCache[parents[1]]==null ) {
                    when(this.store.getChildren({id:parent}), function(result) {
                        me.onChildrenChange({id:parent}, result);
                        me.loadChildren(parents.slice(1))
                    });
                }else {
                    this.loadChildren(parents.slice(1))
                }
            }
        },
        notify: function(url) {
            var parents = this.getParents(url);
            this.loadChildren(parents);
        },
        getParents: function(url) {
            var parents=["/"];
            var parts=url.split("/");
            var c="";
            if (parts.length>2) {
                for (var i =1;i<parts.length-1;i++) {
                    c+="/"+parts[i];
                    parents.push(c);
                }
            }
            return parents;
        }

    });

});

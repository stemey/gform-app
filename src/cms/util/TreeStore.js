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
          // ["","/test","/test/tt"]
            var me = this;
            var unloadedParents = [];
          if (parents.length>1) {
            for (var i = 0; i<parents.length-2; i++)  {
              var next = "/pages"+parents[i+1];
                if (this.childrenCache[next]==null) {
                  unloadedParents.push("/pages"+parents[i]);
                }
              };
          }
          unloadedParents.push("/pages"+parents[parents.length-2]);
          this.doload(unloadedParents);
        }
        ,
        doload: function(paths) {
            var me = this;
          if (paths.length>0) {
            // check if immediate parent is loaded

            var path = paths[0];
            when(this.store.getChildren({id:path}), function(result) {
              me.onChildrenChange({id:path}, result);
              me.doload(paths.slice(1))
            });
          }
        },
        createEntity: function(url) {
          var parents = this.getParents(url);
          this.loadChildren(parents);
        },
        updateEntity: function(entity) {
          var name = entity.url.match(/[^/]+$/)[0];
          var x = this.onChange({id:entity.identifier, name:name, template:entity.template, folder:false});
          //this.deleteEntity(entity.identifier);
          //this.createEntity(entity.url);
        },
        getParent: function(entity) {
          var url = entity.url;
          var parents = this.getParents(url);
          var parent = "/pages"+parents[parents.length-1];
          if (this.childrenCache[parent]!=null) {
            var found = this.childrenCache[parent].filter(function(item) {
              return item.id=entity.id;
            });
            return found.length>0;
          } else {
            return null;
          }
        },
        deleteEntity: function(id) {
          this.onDelete({id:id});
        },
        getParents: function(url) {
            var parents=[""];
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

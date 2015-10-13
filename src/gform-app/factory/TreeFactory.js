define([
    '../util/tree/PathObjectStoreModel',
    'dijit/tree/ObjectStoreModel',
    'dojo/_base/lang',
    'dijit/MenuItem',
    'dojo/aspect',
    'dijit/registry',
    'dijit/Menu',
    '../util/tree/ParentObjectStoreModel',
    '../util/topic',
    '../util/tree/TreeStore',
    'dijit/Tree',
    "dojo/_base/declare",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (PathObjectStoreModel, ObjectStoreModel, lang, MenuItem, aspect, registry, Menu, ParentObjectStoreModel, topic, TreeStore, Tree, declare) {


    return declare([], {

        create: function (ctx, config) {

            var store = ctx.getStore(config.storeId);
            var me = this;
            var realStore = store.mainStore ? store.mainStore : store.name;
            var model;
            // TODO improve the StoreModel selection
            if (!config.storeModel) {
                model = new TreeStore({store: store});
            } else if (config.storeModel.type == "osm") {
                model = new ParentObjectStoreModel({store: store});
            } else if (config.storeModel.type == "gh") {
                model = new PathObjectStoreModel({store: store, root: config.storeModel.root});
            }

            topic.subscribeStore("/added", function (evt) {
                model.createEntity(evt.entity);
            }, realStore);
            topic.subscribeStore("/updated", function (evt) {
                model.updateEntity(evt.entity, evt.oldEntity);
            }, realStore);
            topic.subscribeStore("/deleted", function (evt) {
                model.deleteEntity(evt.id);
            }, realStore);
            topic.subscribeStore("/focus", function (evt) {
            });


            var nodeClicked = function (node) {
                if (store.idProperty in node) {
                    try {

                        var template = store.templateStore + "/" + node[store.typeProperty];//node.folder ? "jcr.folder" : undefined;
                        // TODO we should use the folders own template "base" from the server. Does not work right now.
                        topic.publish("/focus", {id: node[store.idProperty], store: realStore, source: this});
                    } catch (e) {
                        //console.log(e.stack);
                    }
                }
            }
            var props = {
                storeId: store.name,
                title: config.title,
                label: "",
                labelAttr: config.labelAttribute,
                model: model,
                onClick: nodeClicked
            };
            var tree = new Tree(props);
            aspect.after(tree, "startup", function () {
                this.addMenuItem(config, tree, store);
            }.bind(this));

            return tree;
        },
        addMenuItem: function (config, tree, store) {
            if (config.menuItems) {
                var menu = new Menu({
                    targetNodeIds: [tree.id],
                    selector: ".dijitTreeNode"
                });
                config.menuItems.forEach(function (cfg) {
                    var item;
                    if (typeof cfg === "function") {
                        item = new cfg();
                    } else {
                        var props = {};
                        lang.mixin(props, cfg);
                        delete props.type;
                        item = cfg.type(props);
                    }
                    var click;
                    click = function (evt) {
                        var entity = registry.byNode(registry.byNode(evt.target.parentNode).getParent().currentTarget).item
                        item.action({store: store, id: store.getIdentity(entity)})
                    }
                    menu.addChild(new MenuItem({label: item.label, onClick: click}));
                });
            }
        }

    });


});

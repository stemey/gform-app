define([
    'dojo/topic',
    'cms/util/TreeStore',
    'dijit/Tree',
    "dojo/_base/declare",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (topic, TreeStore, Tree, declare) {


    return declare([], {

        create: function (ctx, config) {

            var store = ctx.getStore(config.storeId);
            var me = this;
            var realStore = store.mainStore ? store.mainStore : store.name;

            var model = new TreeStore({store: store});
            topic.subscribeStore("/added", function (evt) {
                model.createEntity(evt.entity.url);
            }, realStore);
            topic.subscribeStore("/updated", function (evt) {
                model.updateEntity(evt.entity, evt.oldEntity);
            }, realStore);
            topic.subscribeStore("/deleted", function (evt) {
                model.deleteEntity(evt.entity);
            }, realStore);
            topic.subscribeStore("/focus", function (evt) {
            });

            var nodeClicked = function (node) {
                if (node.id) {  
                    try {
                        var template = node.template || null;
                        // TODO configure the tree elements real store. and use it as store param.
                        topic.publish("/focus", {id: node.id, store: realStore, source: this, template: template});
                    } catch (e) {
                        //console.log(e.stack);
                    }
                }
            }
            var tree = new Tree({label: "", labelAttr: config.labelAttribute, model: model, onClick: nodeClicked});
            return tree;
        }
    });


});

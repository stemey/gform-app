define([
    'dojo/topic',
    'cms/util/TreeStore',
    'dijit/Tree',
    "dojo/_base/declare",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (topic, UrlTreeModel, Tree, declare) {


    return declare([], {

        create: function (ctx, config) {

            var store = ctx.getStore(config.storeId);
            var me = this;

            var model = new UrlTreeModel({store: store});
            topic.subscribe("/added", function (evt) {
                model.createEntity(evt.entity.url);
            });
            topic.subscribe("/updated", function (evt) {
                //model.updateEntity(evt.entity);
            });
            topic.subscribe("/deleted", function (evt) {
                //model.deleteEntity(evt.entity);
            });
            topic.subscribe("/focus", function (evt) {
                //me.onPageFocus(evt.entity);
            });

            var nodeClicked = function (node) {
                if (node.id) {
                    try {
                        var template = node.template || null;
                        // TODO configure the tree elements real store. and use it as store param.
                        topic.publish("/focus", {id: node.id, store: "/page", source: this, template: template});
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
            }
            var tree = new Tree({label: "  ", labelAttr: config.labelAttribute, model: model, onClick: nodeClicked});
            return tree;
        }
    });


});

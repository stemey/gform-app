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
            var me =this;

            var model=new UrlTreeModel({store: store});
            topic.subscribe("/page/added", function(evt) {
                model.createEntity(evt.url);
            });
            topic.subscribe("/page/updated", function(evt) {
                model.updateEntity(evt.entity);
            });
            topic.subscribe("/page/deleted", function(evt) {
                model.deleteEntity(evt.entity);
            });
            topic.subscribe("/page/focus", function(evt) {
                me.onPageFocus(evt.entity);
            });

            var nodeClicked = function (node) {
                if (node.id) {
                    topic.publish("/page/focus", {id: node.id, source:this, template:node.template});
                }
            }
            var tree = new Tree({label:"  ",labelAttr:config.labelAttribute,model: model, onClick: nodeClicked});
            return tree;
        }
    });


});

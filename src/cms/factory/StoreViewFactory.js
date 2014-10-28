define([
    'dojo/topic',
    './TabFactory',
    "dojo/_base/declare"
], function (topic, TabFactory, declare) {


    return declare([TabFactory], {
        create: function (ctx, config) {
            var container = this.inherited(arguments);
            var me = this;
            topic.subscribe("/focus", function(evt) {

                var storeChild = container.getChildren().filter(function(child) {
                    var store = ctx.getStore(child.storeId);
                    var storeId;
                    if (store.mainStore) {
                        storeId=store.mainStore;
                    }else{
                        storeId=store.name;
                    }
                    return storeId==evt.store;
                })[0];
                container.selectChild(storeChild);
            });

            container.selectChild(container.getChildren()[0]);
            topic.subscribe(container.id+"-selectChild", function(view) {
                var store = ctx.getStore(view.storeId);
                var storeId;
                if (store.mainStore) {
                    storeId=store.mainStore;
                }else{
                    storeId=store.name;
                }
                if (storeId) {
                    ctx.set("storeId",storeId);
                    topic.publish("/store/focus",{source:this,store:storeId});
                }
            });
            return container;
        }
    });


});

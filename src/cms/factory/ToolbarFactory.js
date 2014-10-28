define([
    './ContainerFactory',
    'dijit/Toolbar',
    "dojo/_base/declare"
], function (ContainerFactory, Toolbar, declare) {


    return declare([ContainerFactory], {

        create: function (ctx, config) {

            var toolbar = new Toolbar();
            this.addChildren(ctx, toolbar, config.children);
            ctx.watch("storeId", function(old, nu) {
               toolbar.getChildren().forEach(function(child) {
                   var visible=true;
                   if (child.excludedStoreIds) {
                       visible = child.excludedStoreIds.indexOf(ctx.get("storeId"))<0;
                   }else{
                       visible = !child.storeIds || child.storeIds.indexOf(ctx.get("storeId"))>=0;
                   }
                   child.domNode.style.display=visible?"initial":"none";

               });
            });
            return toolbar;

        }
    });


});

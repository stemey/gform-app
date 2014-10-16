define([
    './ContainerFactory',
    'dijit/layout/TabContainer',
    "dojo/_base/declare"
], function (ContainerFactory, TabContainer, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var container = new TabContainer();
            container.set("style", {width: config.width || "200px", height: "100%"});
            this.addChildren(ctx, container, config.children);
            container.selectChild(container.getChildren()[0]);
            return container;
        }
    });


});

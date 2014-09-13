define([
    './ContainerFactory',
    'dojo/aspect',
    'dijit/layout/TabContainer',
    "dojo/_base/declare"
], function (ContainerFactory, aspect, TabContainer, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var container = new TabContainer();
            container.set("style", {width: "200px", height: "100%"});
            this.addChildren(ctx, container, config.children);
            container.selectChild(container.getChildren()[0]);
            //container.resize({w: 200});
            return container;
        }
    });


});

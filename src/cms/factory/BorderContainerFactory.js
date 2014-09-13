define([
    'dijit/layout/BorderContainer',
    './ContainerFactory',
    "dojo/_base/declare"
], function (BorderContainer, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var container = new BorderContainer();
            this.addChildren(ctx, container, config, function(child, cfg) {
                child.region=cfg.region;
            });
            return container;
        }
    });


});

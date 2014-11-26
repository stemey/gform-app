define([
	'dojo/when',
	'../controller/BorderContainer',
    './ContainerFactory',
    "dojo/_base/declare"
], function (when, BorderContainer, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var container = new BorderContainer();
            container.set("style",{"width":"100%","height":"100%"});
            return this.addChildren(ctx, container, config, function(child, cfg) {
                child.region=cfg.region;
                child.splitter = cfg.splitter === true;
            });

        }
    });


});

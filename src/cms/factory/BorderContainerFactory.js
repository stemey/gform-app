define([
	'../controller/BorderContainer',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (BorderContainer, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new BorderContainer({id:"mainContainer", ctx:ctx, layouts:config.layouts});
			return this.addChildren(ctx, container, config.views, function (child, cfg) {
				child.region = cfg.region;
				child.splitter = cfg.splitter === true;
				child.appType=cfg.appType;
			});

		}
	});


});

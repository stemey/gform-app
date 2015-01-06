define([
	'../controller/BorderContainer',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (BorderContainer, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new BorderContainer({id:"mainContainer"});
			return this.addChildren(ctx, container, config, function (child, cfg) {
				child.region = cfg.region;
				child.splitter = cfg.splitter === true;
			});

		}
	});


});

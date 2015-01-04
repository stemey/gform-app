define([
	'../controller/PreviewDispatcher',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (PreviewDispatcher, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new PreviewDispatcher({ctx:ctx});
			//container.set("style", {width: config.width || "200px", height: "100%"});
			this.addChildren(ctx, container, config.children);
			return container;
		}
	});


});

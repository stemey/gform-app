define([
	"dojo/_base/declare"
], function (declare) {


	return declare([], {
		create: function (ctx, config) {
			var props = config;
			props.ctx = ctx;
			var widget =  new config.widgetClass(props);
			return widget;
		}
	});


});

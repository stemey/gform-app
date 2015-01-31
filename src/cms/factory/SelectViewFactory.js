define([
	'dijit/form/DropDownButton',
	'../controller/ViewMenu',
	"dojo/_base/declare"
], function (DropDownButton, ViewMenu, declare) {


	return declare([], {
		create: function (ctx, config) {
			var menu = new ViewMenu({ctx: ctx});
			var button = new DropDownButton({
				label: config.label,
				dropDown: menu,
				ctx: ctx
			})
			ctx.watch("storeId", function () {

				button.set("label", config.label + ": " + ctx.getCurrentView().label);
			})
			return button;

		}

	});

});

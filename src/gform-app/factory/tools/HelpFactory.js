define([
	'dojo/aspect',
	'dijit/TooltipDialog',
	'dijit/form/DropDownButton',
	"dojo/_base/declare"
], function (aspect, TooltipDialog, DropDownButton, declare) {


	return declare([], {
		create: function (ctx, config) {
			var helpDialog = new TooltipDialog({
				content:""
			});

			var helpButton = new DropDownButton({
				label: "help",
				iconClass:"fa fa-question-circle",
				dropDown: helpDialog
			});
			aspect.after(helpDialog, "_onShow", function() {
				var store = ctx.getStore(ctx.get("storeId"));
				helpDialog.set("content",store.description);
			})

			ctx.watch("storeId", function() {
				var store = ctx.getStore(ctx.get("storeId"));
				if (store.description) {
					helpButton.domNode.style.display="initial";
				} else {
					helpButton.domNode.style.display="none";
				}
			})

			return helpButton;
		}

	});

});

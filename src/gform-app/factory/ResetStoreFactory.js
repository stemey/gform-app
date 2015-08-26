define([
	'../controller/tools/StoreSensitiveMixin',
	'dijit/form/Button',
	"dojo/_base/declare"
], function (StoreSensitiveMixin, Button, declare) {


	return declare([], {
		create: function (ctx, config) {
			var ResetButton = new declare([Button,StoreSensitiveMixin], {
				onStoreChange: function() {
					var store = ctx.getCurrentStore();
					if (store.resetData) {
						this.inherited(arguments);
					}else{
						this.hide();
					}
				}
			});
			return new ResetButton({
				label: config.label,
				iconClass:config.iconClass,
				excludedStoreIds: config.excludedStoreIds,
				includedStoreIds: config.includedStoreIds,
				ctx:ctx,
				onClick: function () {
					["page","/template","partial","file"].forEach(function(storeId) {
						var store = ctx.getStore(storeId);
						if (store.resetData) {
							store.resetData();
						}else{
							this.hide();
						}
					})
				}
			})
		}
	});


});

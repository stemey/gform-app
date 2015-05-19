define([
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {


	return declare([], {
		ctx: null,
		postCreate: function () {
			this.inherited(arguments);
			this.ctx.watch("storeId", lang.hitch(this, "onStoreChange"));
		},
		onStoreChange: function () {
			var storeId = this.ctx.get("storeId");
			if (this.includedStoreIds) {
				if (this.includedStoreIds.indexOf(storeId) >= 0) {
					this.show();
				} else {
					this.hide();
				}
			} else if (this.excludedStoreIds) {
				if (this.excludedStoreIds.indexOf(storeId) < 0) {
					this.show();
				} else {
					this.hide();
				}
			} else {
				this.show();
			}
		},
		show: function() {
			this.domNode.style.display="initial";
		},
		hide: function() {
			this.domNode.style.display="none";
		}
	})
});

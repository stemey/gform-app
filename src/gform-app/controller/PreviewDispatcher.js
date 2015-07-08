define([
	'dijit/layout/StackContainer',
	'dojo/_base/lang',
    "dojo/_base/declare"
], function (StackContainer, lang, declare) {


	return declare("cms.PreviewDispatcher", [StackContainer], {
		ctx: null,
		postCreate: function () {
			this.inherited(arguments);
			this.ctx.watch("storeId", lang.hitch(this, "onStoreChange"));

		},
        onStoreChange: function () {
			var store = this.ctx.getCurrentStore();
			var selected = this._selectChildByStore(store);

		},
		_selectChildByStore: function (store) {
			var previewerId = store.previewerId;
			if (previewerId) {
				if (!this.selectedChildWidget || this.selectedChildWidget.previewerId !== previewerId) {
					var selectedChild = null;
					this.getChildren().some(function (child) {
						if (child.previewerId == previewerId) {
							selectedChild = child;
						}
					});
					if (selectedChild) {
						this.selectChild(selectedChild);
						return true;
					}
				} else {
					return true;
				}
			}
			return false;
		}
	});
});

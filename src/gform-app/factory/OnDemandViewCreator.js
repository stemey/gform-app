define([
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {


	return declare([], {
		container: null,
		ctx:null,
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		create: function (creator) {
			var handler = {
				container: this.container,
				creator: creator,
				widget: null,
				ctx:this.ctx,
				onFocus: function (evt) {
					var store=this.ctx.get("storeId");
					if (creator.isStore(store)) {
						if (this.widget == null) {
							this.widget = creator.create();
							if (!this.widget) {
								throw "needs to return a widget";
							}
							this.container.addChild(this.widget);
						}
						this.container.selectChild(this.widget);
					}
				},
				remove: function () {
					if (this.widget) {
						this.container.removeChild(this.widget);
					}
				}
			}
			this.ctx.watch("storeId", handler.onFocus.bind(handler))
			return handler;
		}
	});


});

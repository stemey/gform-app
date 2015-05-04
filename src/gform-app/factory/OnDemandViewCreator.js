define([
	'dojo/_base/lang',
	'dojo/topic',
	"dojo/_base/declare"
], function (lang, topic, declare) {


	return declare([], {
		container: null,
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		create: function (creator) {
			var handler = {
				container: this.container,
				creator: creator,
				widget: null,
				onFocus: function (evt) {
					if (creator.isStore(evt.store)) {
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
			topic.subscribe("/focus", handler.onFocus.bind(handler))
			topic.subscribe("/store/focus", handler.onFocus.bind(handler))
			return handler;
		}
	});


});

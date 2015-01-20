define([
	'dojo/topic',
	'dojo/Stateful',
	"dojo/_base/declare"//
], function (topic, Stateful, declare) {

	return declare([Stateful], {
		storeRegistry: null,
		storeId: null,
		views: [],
		constructor: function (config) {
			this.storeRegistry = config.storeRegistry;
		},
		getStore: function (id) {
			return this.storeRegistry.get(id);
		},
		getCurrentStore: function () {
			return this.storeRegistry.get(this.get("storeId"));
		},
		getViews: function () {
			return this.views;
		},
		addView: function (view) {
			this.views.push(view);
			topic.publish("/view/new", view);
		},
		removeView: function (view) {
			var idx = this.views.indexOf(view);
			if (idx>=0) {
				this.views.remove(idx);
				topic.publish("/view/remove", view);
			}
		}
	});
});

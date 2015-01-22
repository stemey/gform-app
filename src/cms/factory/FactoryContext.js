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
		addStore: function (id, store) {
			this.storeRegistry.register(id, store);
		},
		removeStore: function (id) {
			this.storeRegistry.unregister(id);
		},
		addSchema: function (id, schema) {
			this.schemaRegistry.register(id, schema);
		},
		removeView: function (view) {
			var idx = this.views.indexOf(view);
			if (idx >= 0) {
				this.views.remove(idx);
				topic.publish("/view/remove", view);
			}
		},
		addSchemaStore: function (id, store) {
			this.schemaRegistry.registerStore(id, store);
		}
	});
});

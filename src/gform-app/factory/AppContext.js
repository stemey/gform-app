define([
	'dojo/topic',
	'dojo/Stateful',
	"dojo/_base/declare"
], function (topic, Stateful, declare) {

	return declare([Stateful], {
		storeRegistry: null,
		schemaRegistry:null,
		storeId: null,
		// TODO make default view configurable
		views: [],//{id: "documentation", label: "documentation"}],
		constructor: function (config) {
			this.storeRegistry = config.storeRegistry;
		},
		getStore: function (id) {
			return this.storeRegistry.get(id);
		},
		getSchema: function(id) {
			return this.schemaRegistry.get(id);
		},
		getCurrentStore: function () {
			return this.storeRegistry.get(this.storeId);
		},
		getCurrentStore: function () {
			return this.storeRegistry.get(this.get("storeId"));
		},
		getCurrentView: function () {
			var subViews = this.views.filter(function (view) {
				return view.id == this.storeId;
			}, this);
			if (subViews.length == 0) {
				return {};
			} else {
				return subViews[0];
			}
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
		removeView: function (view) {
			var idx = this.views.indexOf(view);
			if (idx >= 0) {
				this.views.remove(idx);
				topic.publish("/view/deleted", view);
			}
		},
		addSchema: function (id, schema) {
			this.schemaRegistry.register(id, schema);
		},
		addSchemaStore: function (id, store) {
			this.schemaRegistry.registerStore(id, store);
		},
		removeSchemaStore: function (id, store) {
			this.schemaRegistry.unregisterStore(id, store);
		}
	});
});

define([
	'../util/tree/TreeMixin',
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/topic',
	'dojo/aspect',
	'./load',
	'./ContainerFactory',
	"dojo/_base/declare",
	'dojo/when'
], function (TreeMixin, Deferred, lang, topic, aspect, load, ContainerFactory, declare, when) {


	return declare([ContainerFactory], {
		_load: function (store, config) {
			//aspect.around(store, "put", lang.hitch(me, "onPageUpdated", store));
			lang.mixin(store, config);
			aspect.around(store, "remove", lang.hitch(this, "onPageDeleted", store));
			aspect.around(store, "add", lang.hitch(this, "onPageAdded", store));
			var modules = [];
			if (config.plainValueFactory) {
				modules.push({
					id: config.plainValueFactory, fn: function (factory) {
						store.getDefault = factory;
					}
				});
			}
			if (config.createEditorFactory) {
				modules.push({
					id: config.createEditorFactory, fn: function (createEditorFactory) {
						store.editorFactory = createEditorFactory(config.efConfig || {});
					}
				});
			}
			var deferred = new Deferred;
			require(modules.map(function (m) {
				return m.id
			}), function () {
				for (var idx = 0; idx < arguments.length; idx++) {
					modules[idx].fn(arguments[idx]);
				}
				deferred.resolve(store);
			})
			return deferred;
		},
		create: function (config) {
			var me = this;
			return load([config.storeClass], function (storeClass) {
				if (config.parentProperty) {
					storeClass = declare([storeClass,TreeMixin]);
				}
				var store = new storeClass(config);
				return me._load(store, config);
			});
		},
		onPageUpdated: function (store, superCall) {
			var me = this;
			return function (entity) {
				var result = superCall.apply(this, arguments);
				when(result).then(function () {
					topic.publish("/updated", {store: store.name, id: store.getIdentity(entity), entity: entity})
				});
				return result;
			}
		},
		onPageDeleted: function (store, superCall) {
			var me = this;
			return function (entity) {
				var result = superCall.apply(this, arguments);
				topic.publish("/deleted", {store: store.name, id: store.getIdentity(entity), entity: entity})
				return result;
			}
		},
		onPageAdded: function (store, superCall) {
			var me = this;
			return function (entity) {
				var result = superCall.apply(this, arguments);
				when(result).then(function (id) {
					topic.publish("/added", {store: store.name, id: id, entity: entity})
				});
				return result;
			}
		}
	});
});

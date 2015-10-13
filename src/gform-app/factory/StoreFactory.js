define([
	'dojo/request',
	'../util/tree/TreeMixin',
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/topic',
	'dojo/aspect',
	'./load',
	'./ContainerFactory',
	"dojo/_base/declare",
	'dojo/when'
], function (request, TreeMixin, Deferred, lang, topic, aspect, load, ContainerFactory, declare, when) {


	return declare([ContainerFactory], {
		_load: function (store, config) {
           aspect.around(store, "put", lang.hitch(this, "onPageUpdated", store));
			lang.mixin(store, config);

			if (config.initialDataUrl) {
				store.resetData= function() {
					when(store.query({})).then(function(results) {
						results.forEach(function(e) {
							try {
								store.remove(store.getIdentity(e));
							} catch (e) {
								// TODO ui throws errors when data ist reset
							}
						})
						request(url, {handleAs: "json"}).then(function (data) {
							data.forEach(function (e) {
								store.add(e);
							});
						});
					});
				}
				var url = config.initialDataUrl;
				when(store.query({})).then(function(results){
					if (results.length==0) {
						store.resetData();
					}
				})
			}

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
				if (config.treeMixin) {
					storeClass = declare([storeClass,TreeMixin]);
				}
				var store = new storeClass(config);
				return me._load(store, config);
			});
		},
		onPageUpdated: function (store, superCall) {
			var me = this;
			return function (entity, options) {
				var result = superCall.apply(this, arguments);
				when(result).then(function () {
                    // filter out the add calls that delegate to put.
                    if (options && options.overwrite) {
                        topic.publish("/updated", {store: store.name, id: store.getIdentity(entity), entity: entity, oldEntity:options.old})
                    } else if (!options) {
					    topic.publish("/updated", {store: store.name, id: store.getIdentity(entity), entity: entity})
                    }
				});
				return result;
			}
		},
		onPageDeleted: function (store, superCall) {
			var me = this;
			return function (id) {
				var result = superCall.apply(this, arguments);
				topic.publish("/deleted", {store: store.name, id: id});
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

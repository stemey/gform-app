define([
	'./SubStore',
	'dojo/_base/lang',
	'../schema/SchemaStore',
	'dojo/Deferred',
	"dojo/_base/declare",
	'../../util/topic',
	'dojo/aspect',
	'dojo/when'
], function (SubStore, lang, SchemaStore, Deferred, declare, topic, aspect, when) {


	return declare([], {

		ctx: null,
		config: null,
		StoreClass: null,
		storeFactory: null,
		createEditorFactory: null,
		metaStore: null,
		schemaStore: null,
		stores: null,
		destructions: null,
		schemaTransformer: null,
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
			this.metaStore = this.ctx.getStore(this.config.storeId);
			this.schemaStore = this.ctx.getStore(this.config.schemaStore);
			this.stores = {};
			this.destructions = {};
			var me = this;
			aspect.after(this.metaStore, "add", function (result, args) {
				var store = args[0];
				var a = args;
				when(result).then(function (result) {
					// TODO stores should return persisted object. assume that return value is the id for now.
					if (typeof result === "object") {
						store = result;
					} else {
						var id = result;
						store[me.metaStore.idProperty] = id;
					}
					me.addMeta(store);
					topic.publish("/store/new", {store: store.name});
				});

			})
			aspect.after(this.metaStore, "remove", function (result, args) {
				// we don't know the entity. only the id.
				when(result).then(function () {
					var store = me.removeMeta(args[0]);
					topic.publish("/store/deleted", {store: store.name});
				});
			})
			aspect.after(this.metaStore, "put", function (result, args) {
				// we don't know the entity. only the id.
				when(result).then(function () {
					var store = me.updateMeta(args[0]);
					topic.publish("/store/updated", {store: store.name});
				});
			})
            /*
			topic.subscribeStore("/updated", function (e) {
				when(me.metaStore.get(e.id)).then(function (result) {
					var store = me.updateMeta(result);
					topic.publish("/store/updated", {store: store.name});
				})
				// TODO his needs to be configurable
			}, ["/mdbcollection"]);
			*/


		},
		reload: function () {
			var deferred = new Deferred();
			var me = this;
			this.stores = {};
			when(this.metaStore.query({})).then(function (metas) {
				metas.forEach(function (meta) {
					me.updateMeta(meta);
				})
				deferred.resolve("done");
			}).otherwise(deferred.reject);
			return deferred;
		},
		load: function () {
			var deferred = new Deferred();
			var me = this;
			this.stores = {};
			when(this.metaStore.query({})).then(function (metas) {
				metas.forEach(function (meta) {
					me.addMeta(meta);
				})
				deferred.resolve("done");
			}).otherwise(deferred.reject);
			return deferred;
		},
		updateMeta: function (meta) {
			this.removeMeta(this.metaStore.getIdentity(meta));
			return this.addMeta(meta);
		},
		removeMeta: function (id) {
			var store = this.stores[id];
			if (store) {
				delete this.stores[id];
				var metaId=[this.metaStore.getIdentity(store)];
				this.ctx.removeStore(metaId);
				var destruction = this.destructions[id];
				if (destruction) {
					destruction();
					delete this.destructions[id];
				}
			}
			return store;
		},
		createStore: function (meta) {
			// target is a store specific prop
			var target = this.config.url ? lang.replace(this.config.url, meta) : "dummy";
			var props = {
				editorFactory: this.createEditorFactory(this.config.efConfig),
				metaStore: this.metaStore.name,
				metaId: this.metaStore.getIdentity(meta),
				description: meta.description,
				fallbackSchema: this.config.fallbackSchema,
				idProperty: this.config.idProperty,
				name: this.metaStore.getIdentity(meta),
				assignableId: meta.assignableId
			}
			var store;
			if (this.config.storeClass) {
				store = new this.config.storeClass({
					idProperty: this.config.idProperty,
					target: target
				});
			} else {
				store = this.config.storeFactory(this.config, meta, props);
			}
			lang.mixin(store, props);
			return store;
		},
		addMeta: function (meta) {
			this.stores[this.metaStore.getIdentity(meta)] = meta;
			// contains the schemas
			// TODO don't use collection but rather storeId.
			var store = this.createStore(meta);
			if (!meta.schema) {
				store.template = this.config.fallbackSchema;
			} else if (meta.schema.schema) {
				this.addSingleStore(meta, store);
			} else {
				this.addMultiStore(meta, store);
			}
			this.ctx.addStore(this.metaStore.getIdentity(meta), store);
			return store;
		},
		addSingleStore: function (meta, store) {
			// TODO changing the schema entity will not affect the registered schema.
			store.template = this.schemaStore.name + "/" + meta.schema.schema;
		},
		addMultiStore: function (meta, store) {
			var templateStoreName = "/schema-" + meta.name;
			store.templateStore = templateStoreName;
			store.typeProperty = meta.schema.typeProperty;
			var filterStore = new SubStore({
				schemaStore: this.schemaStore,
				meta: meta
			});
			// TODO clean up store wrappings and schema transformation
			filterStore.name = templateStoreName;
			var transformer = this.schemaTransformer;
			var transformedSchemaStore = new SchemaStore({
				store: filterStore,
				transformer: transformer
			});
			transformedSchemaStore.name = filterStore.name;
			transformedSchemaStore.template = this.schemaStore.template;
			transformedSchemaStore.idProperty = this.schemaStore.idProperty;
			transformedSchemaStore.getIdentity = this.schemaStore.getIdentity.bind(this.schemaStore);
			transformedSchemaStore.instanceStore = store.name;

			this.ctx.addSchemaStore(transformedSchemaStore.name, transformedSchemaStore)
			this.ctx.addStore(transformedSchemaStore.name, transformedSchemaStore);
			this.destructions[store.name] = function () {
				this.ctx.removeSchemaStore(transformedSchemaStore.name)
				this.ctx.removeStore(transformedSchemaStore.name);
			}.bind(this);
		}
	});
});

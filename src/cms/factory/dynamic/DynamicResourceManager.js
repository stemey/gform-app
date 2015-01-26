define([
	'./SubStore',
	'dojo/_base/lang',
	'../schema/SchemaStore',
	'dojo/Deferred',
	"dojo/_base/declare",
	'dojo/topic',
	'dojo/aspect'
], function (SubStore, lang, SchemaStore, Deferred, declare, topic, aspect) {


	return declare([], {

		ctx: null,
		config: null,
		StoreClass: null,
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
				result.then(function (id) {
					// TODO stores should return persisted object. assume that return value is the id for now.
					store[me.metaStore.idProperty] = id;
					me.addMeta(store);
					topic.publish("/store/new", {store: store.name});
				});

			})
			aspect.after(this.metaStore, "remove", function (result, args) {
				// we don't know the entity. only the id.
				result.then(function () {
					var store = me.removeMeta(args[0]);
					topic.publish("/store/deleted", {store: store.name});
				});
			})
			aspect.after(this.metaStore, "put", function (result, args) {
				// we don't know the entity. only the id.
				result.then(function () {
					var store = me.updateMeta(args[0]);
					topic.publish("/store/updated", {store: store.name});
				});
			})

		},
		load: function () {
			var deferred = new Deferred();
			var me = this;
			this.stores = {};
			this.metaStore.query({}).then(function (metas) {
				metas.forEach(function (meta) {
					me.addMeta(meta);
				})
				deferred.resolve("done");
			}).otherwise(deferred.reject);
			return deferred;
		},
		updateMeta: function (meta) {
			var store = this.removeMeta(this.metaStore.getIdentity(meta));
			this.addMeta(meta);
			return store;
		},
		removeMeta: function (id) {
			var store = this.stores[id];
			if (store) {
				delete this.stores[id];
				this.ctx.removeStore(store.name);
				var destruction = this.destructions[store.name];
				if (destruction) {
					destruction();
					delete this.destructions[store.name];
				}
			}
			return store;
		},
		createStore: function (meta) {
			return new this.StoreClass({
				idProperty: this.config.idProperty,
				name: meta.name,
				assignableId: meta.assignableId,
				target: this.config.baseUrl + meta.collection + "/",
				editorFactory: this.createEditorFactory(this.config.efConfig),
				metaStore:this.metaStore.name,
				metaId:this.metaStore.getIdentity(meta)
			});
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
			this.ctx.addStore(meta.name, store);
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
			transformedSchemaStore.typeProperty = meta.schema.typeProperty;
			transformedSchemaStore.idProperty = store.idProperty;
			transformedSchemaStore.getIdentity = store.getIdentity.bind(store);
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

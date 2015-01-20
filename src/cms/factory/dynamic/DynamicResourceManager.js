define([
	'dojo/_base/lang',
	'dojo/promise/all',
	'../../mongodb/SchemaTransformer',
	'../schema/SchemaStore',
	'dojo/Deferred',
	"dojo/_base/declare",
	'dojo/topic',
	'dojo/aspect',
	'dojo/promise/all',
], function (lang, all, SchemaTransformer, SchemaStore, Deferred, declare, topic, aspect, all) {


	return declare([], {

		ctx: null,
		config: null,
		StoreClass: null,
		createEditorFactory: null,
		metaStore: null,
		schemaStore: null,
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
			this.metaStore = this.ctx.getStore(this.config.storeId);
			this.schemaStore = this.ctx.getStore(this.config.schemaStore);
			var me = this;
			aspect.after(this.metaStore, "add", function (result, args) {
				var store = args[0].name;
				result.then(function () {
					me.addMeta(store);
					topic.publish("/store/new", {store: store});
				});

			})
			aspect.after(this.metaStore, "remove", function (result, args) {
				// we don't know the entity. only the id.
				result.then(function () {
					topic.publish("/store/deleted", {});
				});
			})

		},
		addMeta: function (meta) {
			// contains the schemas
			var deferred = new Deferred();
			// TODO don't use collection but rather storeId.
			var store = new this.StoreClass({
				idProperty: this.config.idProperty,
				name: meta.name,
				target: this.config.baseUrl + meta.collection + "/",
				editorFactory: this.createEditorFactory(this.config.efConfig)
			});

			if (meta.schema === null) {
				store.template = this.config.fallbackSchema;
				deferred.resolve("done");
			} else if (meta.schema.schema) {
				// TODO changing the schema entity will not affect the registered schema.
				this.schemaStore.get(meta.schema.schema).then(function (schema) {
					var transformer = new SchemaTransformer(this.ctx);
					var p = transformer.transform(schema);
					this.ctx.schemaRegistry.register(meta.name, p);
					deferred.resolve("done");
				})
				store.template = meta.name;
			} else {

				var templateStoreName = "/schema-" + meta.name;
				store.templateStore = templateStoreName;
				store.typeProperty = meta.schema.typeProperty;
				var filterStore = new declare([], {
					schemaStore: this.schemaStore,
					metaStore: this.metaStore,
					get: function (id) {
						return this.schemaStore.get(id);
					},
					query: function (q) {
						var metaPromise = this.metaStore.get(meta[this.metaStore.idProperty]);
						var p = this.schemaStore.query(q);
						var d = new Deferred();
						all([p, metaPromise]).then(function (results) {
							var filtered = results[0].filter(function (e) {
								// TODO don't use _id here. use IdProperty
								return results[1].schema.schemas.indexOf(e._id) >= 0;
							});
							d.resolve(filtered);
						});
						return d;
					}
				})();
				// TODO clean up store wrappings and schema transformation
				filterStore.name = templateStoreName;
				var transformer = new SchemaTransformer(this.ctx);
				transformer.baseUrl = this.schemaStore.target;
				var transformedSchemaStore = new SchemaStore({
					store: filterStore,
					transformer: transformer
				});
				transformedSchemaStore.name = filterStore.name;
				transformedSchemaStore.typeProperty = meta.schema.typeProperty;
				transformedSchemaStore.idProperty = store.idProperty;
				transformedSchemaStore.getIdentity = store.getIdentity.bind(store);
				transformedSchemaStore.instanceStore = store.name;

				this.ctx.schemaRegistry.registerStore(transformedSchemaStore.name, transformedSchemaStore)
				this.ctx.storeRegistry.register(transformedSchemaStore.name, transformedSchemaStore);

				deferred.resolve("done");
			}
			this.ctx.storeRegistry.register(meta.name, store);
			return deferred;
		}
	});
});

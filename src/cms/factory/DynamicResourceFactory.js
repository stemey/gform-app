define([
	'./schema/SchemaStore',
	'dojo/Deferred',
	"dojo/_base/declare",
	'cms/meta/TemplateSchemaTransformer'
], function (SchemaStore, Deferred, declare,TemplateSchemaTransformer) {


	return declare([], {
		create: function (ctx, config) {
			var deferred = new Deferred();
			require(['dojo/promise/all',
				config.storeClass, config.createEditorFactory], function (all, Store, createEditorFactory) {
				// contains the information about store and its schemas
				var metaStore = ctx.getStore(config.storeId);
				// contains the schemas
				var schemaStore = ctx.getStore(config.schemaStore);

				metaStore.query({}).then(function (metas) {
					metas.forEach(function (meta) {

						var store = new Store({
							idProperty: config.idProperty,
							name: meta.name,
							target: config.baseUrl + meta.collection + "/",
							editorFactory: createEditorFactory(config.efConfig)
						});

						if (meta.schema.schema) {
							schemaStore.get(meta.schema.schema).then(function(schema) {
								// TODO getting the group prop should be done by TemplateSchemaTransformer
								ctx.schemaRegistry.register(meta.name, schema.group);
								deferred.resolve("done");
							})
							store.template=meta.name;
							ctx.storeRegistry.register(meta.name, store);
						}else {

							var templateStoreName = "/schema-" + meta.name;
							store.templateStore = templateStoreName;
							store.typeProperty=meta.schema.typeProperty;
							var filterStore = new declare([], {
								get: function (id) {
									return schemaStore.get(id);
								},
								query: function (q) {
									var metaPromise = metaStore.get(meta[metaStore.idProperty]);
									var p = schemaStore.query(q);
									var d = new Deferred();
									all([p,metaPromise]).then(function (results) {
										var filtered = results[0].filter(function (e) {
											return results[1].schema.schemas.indexOf(e._id)>=0;
										});
										d.resolve(filtered);
									});
									return d;
								}
							})();
							filterStore.name = templateStoreName;
							var transformer = new TemplateSchemaTransformer(filterStore);
							transformer.baseUrl=schemaStore.target;
							var transformedSchemaStore = new SchemaStore({
								store: filterStore,
								transformer: transformer
							});
							transformedSchemaStore.name = filterStore.name;
							transformedSchemaStore.typeProperty =meta.schema.typeProperty;
							transformedSchemaStore.idProperty = store.idProperty;
							transformedSchemaStore.getIdentity=store.getIdentity;
							transformedSchemaStore.instanceStore = store.name;

							ctx.schemaRegistry.registerStore(transformedSchemaStore.name, transformedSchemaStore)
							ctx.storeRegistry.register(transformedSchemaStore.name, transformedSchemaStore);

							ctx.storeRegistry.register(meta.name, store);
							deferred.resolve("done");
						}
					})

				}).otherwise(function (e) {
					console.error("cannot load meta data ",e);
					deferred.reject(e);
				});
			});
			return deferred;
		}
	});
});

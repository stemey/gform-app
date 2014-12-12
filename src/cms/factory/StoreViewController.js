define([
	'dojo/when',
	'dojo/_base/Deferred',
	'dojo/promise/all',
	'gform/schema/meta',
	'dojo/_base/lang',
	'./SingleStoreGridFactory',
	'dojo/topic',
	"dojo/_base/declare"
], function (when, Deferred, all, meta, lang, SingleStoreGridFactory, topic, declare) {


	return declare([], {
		currentStores: null,
		ctx: null,
		factory: null,
		createGridFactory: function(config) {
			return new SingleStoreGridFactory();
		},
		start: function (container, ctx, config, promise) {
			this.promise=promise;
			this.factory = this.createGridFactory(config);
			this.ctx = ctx;
			this.container = container;
			this.currentStores = [];
			this.metaStore = ctx.getStore(config.storeId);
			this.schemaStore = ctx.getStore(config.schemaStoreId);

			var me = this;
			topic.subscribe("/store/new", function (evt) {
				me.refresh();
			});
			this.refresh();
		},
		refresh: function () {
			this.metaStore.query({}).then(lang.hitch(this, "onUpdate"));
		},
		createView: function (meta, schema) {
			var grid = this.factory.create(this.ctx, {schema: schema, title: meta.name, storeId: meta.name});
			return grid;
		},
		mergeSchemas: function (schemas, typeOptions, typeProperty) {
			var attributeSets = schemas.map(function (schema) {
				// TODO that schema is in the group property, is really information from TemplateSchemaTransformer
				return meta.collectAttributesWithoutAdditional(schema.group);
			});
			var combinedAttributes = [];
			var addedAttributes = {};
			attributeSets.forEach(function (attributes) {
				attributes.forEach(function (attribute) {
					if (!addedAttributes[attribute.code]) {
						var a = lang.clone(attribute);
						attribute=a;
						if (attribute.code===typeProperty) {
							attribute.type="string";
							attribute.values=typeOptions;
						}
						combinedAttributes.push(attribute);
						addedAttributes[attribute.code] = attribute;
					}
				});
			});
			return combinedAttributes;
		},
		onUpdate: function (stores) {
			// TODO don't reload everything and do diffing. Implement create, update, remove on specific topic message instead. what about ordering of stores
			var promises = [];
			stores.forEach(function (meta) {
				if (this.currentStores.indexOf(meta.name) < 0) {
					// TODO respect the order of the stores
					if (meta.schema == null || meta.schema.schema) {
						//var template = this.metaStore.template;
						//var metaSchema = this.ctx.schemaRegistry.get(template);
						var me = this;
						var deferred = new Deferred();
						promises.push(deferred);
						var store = this.ctx.getStore(meta.name);
						when(this.ctx.schemaRegistry.get(store.template)).then(function (schema) {
							var child = me.createView(meta, schema);
							me.container.addChild(child);
							me.currentStores.push(meta.name);
							deferred.resolve();
						});
					} else {
						var me = this;
						var store = this.ctx.getStore(meta.name);
						var templateStoreId = store.templateStore;
						var templateStore = this.ctx.getStore(templateStoreId);
						var deferred = new Deferred();
						promises.push(deferred);
						templateStore.query({}).then(function (schemas) {
							var labelMap = [];
							schemas.forEach(function(schema) {
								labelMap.push({value:schema[templateStore.idProperty],label:schema.name});
							});
							var attributes = me.mergeSchemas(schemas, labelMap,store.typeProperty );
							// TODO create schema id to schema name mapping here. add a function to grid.
							var child = me.createView(meta, {attributes: attributes});
							me.container.addChild(child);
							me.currentStores.push(meta.name);
							deferred.resolve();
						})
					}

				}
			}, this);
			var me =this;
			all(promises).then(function() {
				me.promise.resolve();
			})
		}
	});
});

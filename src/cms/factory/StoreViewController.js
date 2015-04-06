define([
	'./OnDemandViewCreator',
	'dojo/when',
	'dojo/_base/Deferred',
	'dojo/promise/all',
	'gform/schema/meta',
	'dojo/_base/lang',
	'./SingleStoreGridFactory',
	'dojo/topic',
	"dojo/_base/declare"
], function (OnDemandViewCreator, when, Deferred, all, meta, lang, SingleStoreGridFactory, topic, declare) {


	return declare([], {
		currentStores: null,
		ctx: null,
		factory: null,
		createGridFactory: function (config) {
			return new SingleStoreGridFactory();
		},
		start: function (container, ctx, config, promise) {
			this.groupProperty = config.groupProperty;
			this.creator = new OnDemandViewCreator({container: container});
			this.promise = promise;
			this.factory = this.createGridFactory();
			this.config = config;
			this.ctx = ctx;
			this.container = container;
			this.currentStores = {};
			this.metaStore = ctx.getStore(config.storeId);
			this.schemaStore = ctx.getStore(config.schemaStoreId);

			var me = this;
			topic.subscribe("/store/new", this.onNew.bind(this));
			topic.subscribe("/store/updated", this.refresh.bind(this));
			topic.subscribe("/store/deleted", this.onDeleted.bind(this));
			this.refresh();
		},
		refresh: function () {
			this.metaStore.query({}).then(lang.hitch(this, "onUpdate"));
		},
		createView: function (meta, schema) {
			var config = {schema: schema, title: meta.name, storeId: meta.name}
			if (this.config.gridConfig) {
				lang.mixin(config, this.config.gridConfig);
			}
			var grid = this.factory.create(this.ctx, config);
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
						attribute = a;
						if (attribute.code === typeProperty) {
							attribute.type = "string";
							attribute.values = typeOptions;
						}
						combinedAttributes.push(attribute);
						addedAttributes[attribute.code] = attribute;
					}
				});
			});
			return combinedAttributes;
		},
		onNew: function (evt) {
			var meta = this.ctx.getStore(evt.store);
			this.addStore(meta);
		},
		onDeleted: function (evt) {
			this.removeStore(evt.store);
		},
		onUpdate: function (stores) {
			// TODO don't reload everything and do diffing. Implement create, update, remove on specific topic message instead. what about ordering of stores
			var promises = [];
			stores.forEach(function (meta) {
				if (!this.currentStores[meta.name]) {
					var p = this.addStore(meta);
					promises.push(p);
				}
			}, this);
			var me = this;
			all(promises).then(function () {
				me.promise.resolve();
			})
		},
		removeStore: function (store) {
			var handler = this.currentStores[store];
			if (handler) {
				handler.remove();
			}
			this.ctx.removeView(store);
		},
		createOnDemandView: function (meta, schema) {
			var me = this;
			var id = meta.name;
			var group = meta[this.groupProperty];
			this.ctx.addView({label: meta.name, id: id, group: group, store: id});
			var creator = {
				isStore: function (store) {
					return meta.name == store;
				},
				create: function () {
					return me.createView(meta, schema);
				}
			}
			this.currentStores[meta.name] = this.creator.create(creator);
		},
		addStore: function (meta) {
			// TODO respect the order of the stores
			var deferred;
			if (meta.schema == null || meta.schema.schema) {
				// single or no schema
				var me = this;
				deferred = new Deferred();
				var store = this.ctx.getStore(meta.name);
				when(this.ctx.schemaRegistry.get(store.template)).then(function (schema) {
					me.createOnDemandView(meta, schema);
					deferred.resolve("done");
				}, function (e) {
					deferred.resolve("failed");
				});
			} else {
				// multiple schemas
				var me = this;
				var store = this.ctx.getStore(meta.name);
				var templateStoreId = store.templateStore;
				var templateStore = this.ctx.getStore(templateStoreId);
				deferred = new Deferred();
				templateStore.query({}).then(function (schemas) {
					var labelMap = [];
					schemas.forEach(function (schema) {
						labelMap.push({value: schema[templateStore.idProperty], label: schema.name});
					});
					var attributes = me.mergeSchemas(schemas, labelMap, store.typeProperty);
					// TODO create schema id to schema name mapping here. add a function to grid.
					me.createOnDemandView(meta, {attributes: attributes});
					deferred.resolve("done");
				})

			}
			return deferred;

		}
	});
});

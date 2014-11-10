define([
	'gform/schema/meta',
	'dojo/_base/lang',
	'./SingleStoreGridFactory',
	'dojo/topic',
	"dojo/_base/declare"
], function (meta, lang, SingleStoreGridFactory, topic, declare) {


	return declare([], {
		currentStores: null,
		ctx: null,
		factory: null,
		start: function (container, ctx, config) {
			this.factory = new SingleStoreGridFactory();
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
		mergeSchemas: function (schemas) {
			var attributeSets = schemas.map(function (schema) {
				// TODO taht schema is in group property is really information from TemplateSchemaTransformer
				return meta.collectAttributes(schema.group);
			});
			var combinedAttributes = [];
			var addedAttributes = {};
			attributeSets.forEach(function (attributes) {
				attributes.forEach(function (attribute) {
					if (!addedAttributes[attribute.code]) {
						combinedAttributes.push(attribute);
						addedAttributes[attribute.code] = attribute;
					}
				});
			});
			return combinedAttributes;
		},
		onUpdate: function (stores) {
			// TODO don't reload everything and do diffing. Implement create, update, remove on specific topic message instead. what about ordering of stores
			stores.forEach(function (meta) {
				if (this.currentStores.indexOf(meta.name) < 0) {
					// TODO respect the order of the stores
					if (meta.schema.schema) {
						//var template = this.metaStore.template;
						//var metaSchema = this.ctx.schemaRegistry.get(template);
						var me = this;
						this.schemaStore.get(meta.schema.schema).then(function (schema) {
							var child = me.createView(meta, schema);
							me.container.addChild(child);
							me.currentStores.push(meta.name);
						})
					} else {
						var me = this;
						var templateStoreId = this.ctx.getStore(meta.name).templateStore;
						var templateStore = this.ctx.getStore(templateStoreId);
						templateStore.query({}).then(function (schemas) {
							var attributes = me.mergeSchemas(schemas);
							var child = me.createView(meta, {attributes: attributes});
							me.container.addChild(child);
							me.currentStores.push(meta.name);
						})
					}

				}
			}, this);
		}
	});
});

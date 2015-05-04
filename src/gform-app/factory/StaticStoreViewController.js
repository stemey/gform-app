define([
	'./OnDemandViewCreator',
	'dojo/when',
	'gform/schema/meta',
	'dojo/_base/lang',
	'./SingleStoreGridFactory',
	"dojo/_base/declare"
], function (OnDemandViewCreator, when, meta, lang, SingleStoreGridFactory, declare) {


	return declare([], {
		createGridFactory: function (config) {
			return new SingleStoreGridFactory();
		},
		start: function (container, ctx, config, promise) {
			this.creator = new OnDemandViewCreator({container: container});
			this.promise = promise;
			this.factory = this.createGridFactory();
			this.config = config;
			this.ctx = ctx;
			this.container = container;
			this.metaStore = ctx.getStore(config.storeId);

			this.refresh();
			this.promise.resolve("done");
		},
		refresh: function () {
			when(this.metaStore.query({})).then(lang.hitch(this, "onUpdate"));
		},
		onUpdate: function (stores) {
			// TODO don't reload everything and do diffing. Implement create, update, remove on specific topic message instead. what about ordering of stores
			var promises = [];
			stores.forEach(function (meta) {
				this.addStore(meta);
			}, this);
		},
		createView: function (meta, schema) {
			var config = {schema: schema, title: meta.name, storeId: meta.name}
			if (this.config.gridConfig) {
				lang.mixin(config, this.config.gridConfig);
			}
			var grid = this.factory.create(this.ctx, config);
			return grid;
		},
		createOnDemandView: function (meta, schema) {
			var me = this;
			this.ctx.addView({label: meta.name, id: meta.name, store: meta.name});
			var creator = {
				isStore: function (store) {
					return meta.name == store;
				},
				create: function () {
					return me.createView(meta, schema);
				}
			}
			this.creator.create(creator);
		},
		addStore: function (meta) {
			// TODO respect the order of the stores
			var me = this;
			var store = this.ctx.getStore(meta.name);
			when(this.ctx.schemaRegistry.get(store.template)).then(function (schema) {
				me.createOnDemandView(meta, schema);
			});
		}
	});
});

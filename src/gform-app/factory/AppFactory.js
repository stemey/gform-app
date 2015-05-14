define([
	'dojo/when',
	'../util/Router',
	'./loadAll',
	'dojo/_base/Deferred',
	'./schema/SchemaRegistryFactory',
	'./BorderContainerFactory',
	'./StoreRegistryFactory',
	'dojo/_base/lang',
	'./AppContext',
	"dojo/_base/declare",
	'dojox/mvc/at'
], function (when, Router, loadAll, Deferred, SchemaRegistryFactory, BorderContainerFactory, StoreRegistryFactory, lang, AppContext, declare) {


	return declare([], {
		deferred: null,
		ctx:null,
		constructor: function (config) {
			this.config = config;
		},
		afterAttached: function () {
			var me = this;
			setTimeout(function () {
				me.router.start(me.ctx.getViews()[0]);
			}, 0);
		},
		create: function (config) {
			new StoreRegistryFactory().create(this.config.storeRegistry).then(lang.hitch(this, "_onConfigured"));
			this.deferred = new Deferred();
			return this.deferred;
		},
		_onConfigured: function (storeRegistry) {
			this.ctx = new AppContext({storeRegistry: storeRegistry});
			this.router = new Router({ctx: this.ctx});
			var p = new SchemaRegistryFactory().create(this.ctx, this.config.schemaRegistry);
			p.then(lang.hitch(this, "_onRegistry", this.ctx)).otherwise(console.log);
		},
		_onRegistry: function (ctx, registry) {
			var me = this;
			this.schemaRegistry = registry;
			ctx.schemaRegistry = registry;
			var p = loadAll(ctx, this.config.resourceFactories || [], function (resource) {
			}, ctx);
			p.then(function () {
				me._onResources(ctx);
			}).otherwise(console.log);
		},
		_onResources: function (ctx) {
			var me = this;
			var promise = new BorderContainerFactory().create(ctx, this.config.view);
			when(promise).then(function (borderContainer) {
				me.deferred.resolve(borderContainer);
			}).otherwise(console.log);
		}
	});


});

define([
	'dojo/when',
	'../util/Router',
	'./loadAll',
	'dojo/_base/Deferred',
	'./schema/SchemaRegistryFactory',
	'./BorderContainerFactory',
	'./StoreRegistryFactory',
	'dojo/_base/lang',
	'./FactoryContext',
	"dojo/_base/declare",
	'dojox/mvc/at'
], function (when, Router, loadAll, Deferred, SchemaRegistryFactory, BorderContainerFactory, StoreRegistryFactory, lang, FactoryContext, declare) {


	return declare([], {
		deferred: null,
		constructor: function (config) {
			this.config = config;
		},
		afterAttached: function () {
			var me = this;
			setTimeout(function () {
				me.router.start();
			}, 0);
		},
		create: function (config) {
			new StoreRegistryFactory().create(this.config.storeRegistry).then(lang.hitch(this, "_onConfigured"));
			this.deferred = new Deferred();
			return this.deferred;
		},
		_onConfigured: function (storeRegistry) {
			var ctx = new FactoryContext({storeRegistry: storeRegistry});
			this.router = new Router({ctx: ctx});
			var p = new SchemaRegistryFactory().create(ctx, this.config.schemaRegistry);
			p.then(lang.hitch(this, "_onRegistry", ctx)).otherwise(console.log);
		},
		_onRegistry: function (ctx, registry) {
			var me = this;
			this.schemaRegistry = registry;
			ctx.schemaRegistry = registry;
			var p = loadAll(ctx, this.config.resourceFactories, function (resource) {
			}, ctx);
			p.then(function () {
				me._onResources(ctx);
			}).otherwise(console.log);
		},
		_onResources: function (ctx) {
			var me = this;
			var promise = new BorderContainerFactory().create(ctx, this.config.views);
			when(promise).then(function (borderContainer) {
				me.deferred.resolve(borderContainer);
			}).otherwise(console.log);
		}
	});


});

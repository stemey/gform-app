define([
	'../util/Router',
	'./loadAll',
    'gform/Context',
    'dojo/_base/Deferred',
    './schema/SchemaRegistryFactory',
    './BorderContainerFactory',
    './StoreRegistryFactory',
    'dojo/_base/lang',
    './FactoryContext',
    "dojo/_base/declare"
], function (Router, loadAll, Context, Deferred, SchemaRegistryFactory, BorderContainerFactory, StoreRegistryFactory, lang, FactoryContext, declare) {


    return declare([], {
        deferred: null,
        constructor: function (config) {
            this.config = config;
        },
        create: function (config) {
            new StoreRegistryFactory().create(this.config.storeRegistry).then(lang.hitch(this, "_onConfigured"));
            this.deferred = new Deferred();
            return this.deferred;
        },
        _onConfigured: function (storeRegistry) {
            var ctx = new FactoryContext({storeRegistry: storeRegistry});
			this.router = new Router({ctx:ctx});
            var p = new SchemaRegistryFactory().create(ctx, this.config.schemaRegistry);
            p.then(lang.hitch(this, "_onRegistry", ctx));

        },
        _onRegistry: function (ctx, registry) {
            var me =this;
            this.schemaRegistry = registry;
            ctx.schemaRegistry = registry;
            var p = loadAll(ctx, this.config.resourceFactories, function (resource) {
            }, ctx);
            p.then(function() {
                me._onResources(ctx);
            })
        },
        _onResources: function (ctx) {
            var borderContainer = new BorderContainerFactory().create(ctx, this.config.views);
            this.deferred.resolve(borderContainer);
        }
    });


});

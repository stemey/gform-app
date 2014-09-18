define([
    'dojo/aspect',
    'gform/Context',
    'dojo/_base/Deferred',
    './schema/SchemaRegistryFactory',
    './BorderContainerFactory',
    './StoreRegistryFactory',
    'dojo/_base/lang',
    'cms/factory/FactoryContext',
    "dojo/_base/declare"
], function (aspect, Context, Deferred, SchemaRegistryFactory, BorderContainerFactory, StoreRegistryFactory, lang, FactoryContext, declare) {


    return declare([], {
        constructor: function(config) {
            this.config=config;
        },
        create: function (config) {
            new StoreRegistryFactory().create(this.config.storeRegistry).then(lang.hitch(this, "_onConfigured"));
            this.deferred = new Deferred();
            return this.deferred;

        },
        _onConfigured: function (storeRegistry) {

            var ctx = new FactoryContext({storeRegistry: storeRegistry});
            ctx.context = new Context();
            ctx.context.storeRegistry = storeRegistry;
            var pageStore = storeRegistry.get("/page");
            var templateStore = storeRegistry.get("/template");
            aspect.around(templateStore, "put", lang.hitch(this, "onTemplateUpdated"));
            // TODO should be published by controller along with oldUrl/oldparentId to implement moving in tree.
            aspect.around(pageStore, "put", lang.hitch(this, "onPageUpdated"));
            aspect.around(pageStore, "remove", lang.hitch(this, "onPageDeleted"));

            var p = new SchemaRegistryFactory().create(ctx, this.config.schemaRegistry);
            p.then(lang.hitch(this, "_onRegistry", ctx));

        },
        _onRegistry: function (ctx, registry) {
            this.schemaRegistry = registry;
            ctx.context.schemaRegistry = registry;

            var borderContainer = new BorderContainerFactory().create(ctx, this.config.views);


            this.deferred.resolve(borderContainer);


        },
        onPageUpdated: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                result.then(function () {
                    //me.refreshPreview();
                    topic.publish("/page/updated", {entity: entity})
                });
                return result;
            }
        },
        onPageDeleted: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                //me.refreshPreview();
                topic.publish("/page/deleted", {entity: entity})
                return result;
            }
        },
        onTemplateUpdated: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                //me.refreshPreview();
                return result;
            }
        }
    });


});

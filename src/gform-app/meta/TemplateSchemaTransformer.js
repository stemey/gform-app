define("gform-app/meta/TemplateSchemaTransformer", [
    '../cms/MultiTemplateRefArrayResolver',
    '../cms/TemplateRefArrayResolver',
    '../cms/MultiTemplateRefResolver',
    '../util/SchemaResolver',
    '../cms/TemplateRefResolver',
    '../dynamicstore/MultiEntityRefResolver',
    '../dynamicstore/SchemaRefResolver',
    'dojo/when',
    'dojo/Deferred',
    './Resolver',
    'dojo/_base/declare'
], function (MultiTemplateRefArrayResolver, TemplateRefArrayResolver, MultiTemplateRefResolver, SchemaResolver, TemplateRefResolver, MultiEntityRefResolver, SchemaRefResolver, when, Deferred, Resolver, declare) {
// module:
//		gform/util/Resolver


    return declare("cms.TemplateSchemaTransfomer", [], {
        idType: null,
        idProperty: null,
        baseUrl: null,
        ctx: null,
        constructor: function (kwArgs) {
            var store = kwArgs.store;
            this.ctx = kwArgs.ctx;
            this.idProperty = store.idProperty;
            this.idType = store.idType;
            this.baseUrl = store.target;
            this.partialStore=kwArgs.partialStore;
        },
        transform: function (schema, skipResolve) {
            var d = new Deferred();
            var resolver = new SchemaResolver(this.ctx);
            resolver.addResolver(new MultiTemplateRefArrayResolver({templateStore:this.partialStore}));
            resolver.addResolver(new MultiEntityRefResolver({idProperty: this.idProperty}))
            resolver.addResolver(new SchemaRefResolver())
            resolver.addResolver(new TemplateRefResolver({templateStore:this.partialStore.name}))
            resolver.addResolver(new TemplateRefArrayResolver({templateStore:this.partialStore.name}))
            resolver.addResolver(new MultiTemplateRefResolver({templateStore:this.partialStore}));
            // TODO schemaResolver modifies input so we need to clone here
            var clonedSchema = JSON.parse(JSON.stringify(schema));
            //var resolver = new Resolver();
            //resolver.idProperty = this.idProperty;
            resolver.baseUrl = this.baseUrl;
            var p;
            if (!skipResolve) {
                p = resolver.resolve(clonedSchema);
                //p = resolver.resolve(schema, this.baseUrl);
            } else {
                p = resolver.resolve(clonedSchema);
                //p = schema;
            }
            var me = this;
            when(p).then(function () {
                // TODO remove dependency on schema property and group property
                d.resolve(clonedSchema);

            }).otherwise(function (e) {
                d.reject(e)
            });
            return d;
        }

    })
});


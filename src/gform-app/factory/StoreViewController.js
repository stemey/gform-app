define([
    './OnDemandViewCreator',
    'dojo/when',
    'dojo/_base/Deferred',
    'dojo/promise/all',
    'gform/schema/meta',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/_base/declare"
], function (OnDemandViewCreator, when, Deferred, all, meta, lang, topic, declare) {


    return declare([], {
        currentStores: null,
        ctx: null,
        factory: null,
        container:null,
        metaStore:null,
        schemaStore:null,
        constructor: function(kwArgs) {
            kwArgs=  kwArgs || {};
            lang.mixin(this, kwArgs);
            this.currentStores= kwArgs.currentStores || [];
        },
        start: function (container, ctx, config, promise) {
            this.groupProperty = config.groupProperty;
            //this.creator = new OnDemandViewCreator({ctx: ctx, container: container});
            // TODO use a parameter instead of instance variable
            this.promise = promise;
            this.config = config;
            this.factory = config.factory;
            this.ctx = ctx;
            this.container = container;
            this.currentStores = {};
            this.metaStore = ctx.getStore(config.storeId);
            this.schemaStore = ctx.getStore(config.schemaStoreId);

            var me = this;
            topic.subscribe("/store/new", this.onNew.bind(this));
            topic.subscribe("/store/updated", this.onUpdateStore.bind(this));
            topic.subscribe("/store/deleted", this.onDeleted.bind(this));
            this.refresh();
        },
        refresh: function () {
            when(this.metaStore.query({})).then(lang.hitch(this, "onUpdate"));
        },
        onUpdateStore: function(evt) {
            when(this.metaStore.get(evt.store)).then(lang.hitch(this, "updateSingleStore"));
        },
        createView: function (meta, schema) {
            var config = {schema: schema, title: meta.name, storeId: this.metaStore.getIdentity(meta)}
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
                var p = this.updateSingleStore(meta);
                promises.push(p);
            }, this);
            var me = this;
            all(promises).then(function () {
                me.promise.resolve();
            })
        },
        updateSingleStore: function(meta) {
            if (this.currentStores[this.getMetaId(meta)]) {
                this.removeStore(this.getMetaId(meta));
            }
            return this.addStore(meta);
        },
        removeStore: function (store) {
            var handler = this.currentStores[store];
            if (handler) {
                handler.remove();
            }
            this.ctx.removeView(store);
        },
        getMetaId: function (meta) {
            return this.metaStore.getIdentity(meta);
        },
        createOnDemandView: function (meta, schema) {
            var me = this;
            var id = this.getMetaId(meta);
            var group = meta[this.groupProperty];
            this.ctx.addView({label: meta.name, id: id, group: group, store: id});
            var creator = {
                isStore: function (store) {
                    return me.getMetaId(meta) === store;
                },
                create: function () {
                    return me.createView(meta, schema);
                }
            }

            var odvc=new OnDemandViewCreator({ctx:this.ctx,creator:creator,container:this.container})
            this.currentStores[this.getMetaId(meta)] = odvc;
        },
        addStore: function (meta) {
            // TODO respect the order of the stores
            var deferred;
            if (!meta.schema || meta.schema.schema) {
                // single or no schema
                var me = this;
                deferred = new Deferred();
                var store = this.ctx.getStore(this.getMetaId(meta));
                when(this.ctx.getSchema(store.template)).then(function (schema) {
                    me.createOnDemandView(meta, schema);
                    deferred.resolve("done");
                }, function (e) {
                    deferred.resolve("failed");
                });
            } else {
                // multiple schemas
                var me = this;
                var store = this.ctx.getStore(this.getMetaId(meta));
                var templateStoreId = store.templateStore;
                var templateStore = this.ctx.getStore(templateStoreId);
                deferred = new Deferred();
                when(templateStore.query({})).then(function (schemas) {
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

define([
        '../../util/LoadRichtextPlugins',
        '../../cms/createValueFactory',
        '../../controller/gridactions/Delete',
        '../../controller/gridactions/OpenAsJson',
        'gform/schema/SchemaGenerator',
        '../../jcr/TemplateStore',
        '../../util/ToMongoQueryTransform'
    ], function (LoadRichtextPlugins, createValueFactory, Delete, OpenAsJson, SchemaGenerator, TemplateStore, ToMongoQueryTransform) {




        // id of store and schema for templates must be /template. Fixed by template.json
        var TEMPLATE_STORE = TEMPLATE_SCHEMA = "/template";
        var PARTIAL_STORE = "partial";

        var PAGE_STORE = "page";

        var createTemplateValueFactory = function(ctx, store) {
            var instanceStore = ctx.getStore(store.instanceStore);
            return createValueFactory.createTemplate(store, instanceStore);
        }
        var createPartialValueFactory = function(ctx,store) {
            return createValueFactory.createPartial(store);
        }

        return function (config) {

            if (!config) {
                config = {}
            }
            if (!config.idProperty) {
                config.idProperty = "id";
                config.idType = "number"
            }
            var schemaGenerator = new SchemaGenerator({requiredAttribute: parent});
            var baseUrl = config.baseUrl;
            return {
                "storeRegistry": {
                    "stores": [
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "dstore/db/LocalStorage",
                            "template": TEMPLATE_SCHEMA,
                            "name": TEMPLATE_STORE,
                            "idProperty": config.idProperty,
                            "instanceStore": "page",
                            "idType": "string",
                            "assignableId": true,
                            "dstoreConfig": {
                                "storeName": TEMPLATE_STORE
                            },
                            "initialDataUrl": "gform-app/example/cms/data/template-data.json",
                            "createEditorFactory": "gform-app/example/cms/createTemplateEditorFactory"
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "dstore/db/LocalStorage",
                            "template": TEMPLATE_SCHEMA,
                            "name": PARTIAL_STORE,
                            "idProperty": config.idProperty,
                            "idType": "string",
                            "assignableId": true,
                            "dstoreConfig": {
                                "storeName": PARTIAL_STORE
                            },
                            "initialDataUrl": "gform-app/example/cms/data/partial-data.json",
                            "createEditorFactory": "gform-app/example/cms/createPartialTemplateEditorFactory"
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "dstore/db/LocalStorage",
                            "templateStore": TEMPLATE_STORE,
                            "name": PAGE_STORE,
                            "previewerId": "handlebars",
                            "typeProperty": "template",
                            "parentProperty": "parent",
                            "idType": "number",// used by createValueFactory
                            "idProperty": config.idProperty,
                            "initialDataUrl": "gform-app/example/cms/data/page-data.json",
                            "dstoreConfig": {
                                "storeName": PAGE_STORE
                            },
                            "createEditorFactory": "gform-app/example/cms/createPageEditorFactory"
                        }
                    ]
                },
                "schemaRegistry": {
                    "factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
                    "registryClass": "gform-app/SchemaRegistry",
                    "stores": [
                        {id: TEMPLATE_STORE, storeClass: TemplateStore, idProperty: config.idProperty},
                        {id: PARTIAL_STORE, storeClass: TemplateStore, idProperty: config.idProperty}
                    ],
                    "schemaGenerators": [
                        {
                            "factoryId": "gform-app/factory/schema/SchemaFactory",
                            "schemaGenerator": schemaGenerator,
                            "store": TEMPLATE_STORE,
                            "partialStore":PARTIAL_STORE
                        },
                        {
                            "factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
                            "module": "gform-app/example/cms/fallbackSchema.json"
                        }
                    ]
                },
                "resourceFactories": [],
                "view": {
                    "startPath": "/store/page",
                    "layouts": {
                        "standard": {
                            "store": {"region": "left", "width": "20%"},
                            "entity": {"region": "right", "width": "40%"},
                            "preview": {"region": "center", width: "100%"}
                        },
                        "/template": {
                            "store": {"region": "left", "width": "50%"},
                            "entity": {"region": "center", width: "100%"},
                            "preview": {"hidden": true, "region": "right"}
                        },
                        "partial": {
                            "store": {"region": "left", "width": "50%"},
                            "entity": {"region": "center", width: "100%"},
                            "preview": {"hidden": true, "region": "right"}
                        }
                    },
                    "views": [
                        {
                            "region": "top",
                            "factoryId": "gform-app/factory/ToolbarFactory",
                            "children": [
                                {
                                    "factoryId": "gform-app/factory/BrandFactory",
                                    "label": "cms<strong style='color:red'>4</strong>apps"
                                },
                                {
                                    "factoryId": "gform-app/factory/MultiSchemaCreateFactory",
                                    "label": "+",
                                    "searchProperty": "name",
                                    "placeHolder": "select template .."
                                },
                                {
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "valueFactory":createTemplateValueFactory,
                                    "includedStoreIds":["/template"]
                                },{
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "valueFactory":createPartialValueFactory,
                                    "includedStoreIds":["partial"]
                                },
                                {
                                 "factoryId": "gform-app/factory/ResetStoreFactory",
                                 "label": "reset store"
                                 },
                                {
                                    "factoryId": "gform-app/factory/ToggleSizeFactory",
                                    "label": "full size",
                                    "includedStoreIds": ["page"]
                                },
                                {
                                    "factoryId": "gform-app/factory/SelectViewFactory",
                                    "label": "view"
                                }

                            ]
                        },
                        {
                            "region": "left",
                            "splitter": true,
                            "appType": "store",
                            "width": "400px",
                            "factoryId": "gform-app/factory/StoreViewFactory",
                            "controllers": [],
                            "children": [
                                {
                                    "factoryId": "gform-app/factory/TabFactory",
                                    "storeId": "page",
                                    "children": [
                                        {
                                            "factoryId": "gform-app/factory/TreeFactory",
                                            "title": "tree",
                                            "osm": true,
                                            "storeId": "page",
                                            "labelAttribute": "name",
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ]

                                        },
                                        {
                                            "factoryId": "gform-app/factory/GridFactory",
                                            "title": "grid",
                                            "storeId": "page",
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ],
                                            "columns": [
                                                {
                                                    "id": "name",
                                                    "field": "name",
                                                    "name": "name"
                                                },
                                                {
                                                    "id": "template",
                                                    "field": "template",
                                                    "name": "template"
                                                },
                                                {
                                                    "id": "parent",
                                                    "field": "parent",
                                                    "name": "parent"
                                                }
                                            ],
                                            sync: true,
                                            conditions: {
                                                "string": ["equal"],
                                                "number": ["equal"],
                                                "date": ["equal"],
                                                "time": ["equal"],
                                                "enum": ["equal"],
                                                "boolean": ["equal"]
                                            }

                                        }
                                    ]
                                }
                                ,
                                {
                                    "factoryId": "gform-app/factory/GridFactory",
                                    "title": "template",
                                    "storeId": TEMPLATE_STORE,
                                    "gridxQueryTransform": new ToMongoQueryTransform(),
                                    "menuItems": [
                                        Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                    ],
                                    "columns": [
                                        {
                                            "id": "name",
                                            "field": "name",
                                            "name": "name"
                                        }
                                    ]
                                },
                                {
                                    "factoryId": "gform-app/factory/GridFactory",
                                    "title": "partial templates",
                                    "storeId": PARTIAL_STORE,
                                    "gridxQueryTransform": new ToMongoQueryTransform(),
                                    "menuItems": [
                                        Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                    ],
                                    "columns": [
                                        {
                                            "id": "name",
                                            "field": "name",
                                            "name": "name"
                                        }
                                    ]
                                }]
                        },
                        {
                            "region": "center",
                            "appType": "preview",
                            "factoryId": "gform-app/factory/PreviewDispatcherFactory",
                            "splitter": true,
                            "children": [
                                {
                                    "previewerId": "handlebars",
                                    "region": "center",
                                    "factoryId": "gform-app/factory/PreviewerFactory",
                                    "splitter": true,
                                    "rendererClass": "gform-app/preview/handlebars/Renderer",
                                    "pageStore": PAGE_STORE,
                                    "urlProperty": "id"
                                }
                            ]
                        },
                        {
                            "width": "100%",
                            "region": "right",
                            "appType": "entity",
                            "factoryId": "gform-app/factory/TabOpenerFactory",
                            "splitter": true
                        }
                    ]
                }

            }
        }
    }
);

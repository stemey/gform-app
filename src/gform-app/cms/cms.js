define([

        'gform/util/Resolver',
        '../controller/tools/Link',
        './createValueFactory',
        '../controller/gridactions/Delete',
        '../controller/gridactions/OpenAsJson',
        '../jcr/TemplateStore',
        '../util/ToMongoQueryTransform',
        "dojo/text!./schema/binary.json",
        "dojo/text!./schema/folder.json",
        "dojo/text!./schema/text.json",
        "dojo/text!./schema/types.json",
        './LoadRichtextPlugins'
    ], function (Resolver, Link, createValueFactory, Delete, OpenAsJson, TemplateStore, ToMongoQueryTransform, binarySchema, folderSchema, textSchema, types) {




        // id of store and schema for templates must be /template. Fixed by template.json
        var TEMPLATE_STORE = TEMPLATE_SCHEMA = "/template";
        var PARTIAL_STORE = "partial";
        var FILE_STORE = "file";
        var FILE_SCHEMA_STORE = "fileSchemaStore";

        var PAGE_STORE = "page";

        var textMappings = JSON.parse(types).types.filter(function (mapping) {
            return mapping.type == "text" && mapping.ace;
        }).map(function (mapping) {
            return {label: mapping.name, value: mapping.ace};
        });
        var text = {};
        new Resolver({values: {textMappings: textMappings}}).resolve(JSON.parse(textSchema)).then(function (schema) {
            text = schema;
        });

        var createTemplateValueFactory = function (ctx, store) {
            var instanceStore = ctx.getStore(store.instanceStore);
            return createValueFactory.createTemplate(store, instanceStore);
        }
        var createPartialValueFactory = function (ctx, store) {
            return createValueFactory.createPartial(store);
        }


        return function (config, stores) {

            if (!config) {
                config = {}
            }
            if (!config.idProperty) {
                config.idProperty = "id";
                config.idType = "number"
            }


            stores.push({
                "factoryId": "gform-app/factory/StoreFactory",
                "name": FILE_SCHEMA_STORE,
                "storeClass": "dojo/store/Memory",
                "idProperty": "id",
                "data": [text, JSON.parse(binarySchema), JSON.parse(folderSchema)]
            });


            var baseUrl = config.baseUrl;
            return {
                "storeRegistry": {
                    "stores": stores
                },
                "schemaRegistry": {
                    "factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
                    "registryClass": "gform-app/SchemaRegistry",
                    "stores": [
                        {id: FILE_SCHEMA_STORE},
                        {
                            id: TEMPLATE_STORE,
                            storeClass: TemplateStore,
                            idProperty: config.idProperty,
                            partialStore: PARTIAL_STORE
                        },
                        {
                            id: PARTIAL_STORE,
                            storeClass: TemplateStore,
                            idProperty: config.idProperty,
                            partialStore: PARTIAL_STORE
                        }
                    ],
                    "schemaGenerators": [
                        {
                            "factoryId": "gform-app/cms/SchemaFactory",
                            "store": TEMPLATE_STORE,
                            "partialStore": PARTIAL_STORE,
                            "sourceRefQuery": {"contentMode": {"$regex": "handlebars"}},
                            "sourceCodeModes": [
                                {
                                    "label": "handlebars",
                                    "value": "ace/mode/handlebars"
                                }
                            ]
                        },
                        {
                            "factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
                            "module": "gform-app/cms/schema/fallbackSchema.json"
                        }
                    ]
                },
                "resourceFactories": [],
                "view": {
                    "startPath": config.startPath,
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
                        },
                        "file": {
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
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "includedStoreIds": ["page", "file"]
                                },
                                {
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "valueFactory": createTemplateValueFactory,
                                    "includedStoreIds": ["/template"]
                                }, {
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "valueFactory": createPartialValueFactory,
                                    "includedStoreIds": ["partial"]
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
                                },
                                {
                                    "factoryId": "gform-app/factory/WidgetFactory",
                                    "widgetClass": Link,
                                    "label": "github",
                                    "iconClass": "fa fa-github",
                                    "style": "float:right;padding-right:10px;",
                                    "url": "http://github.com/stemey/gform-app"
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
                                            // for local storage "osm": true,
                                            storeModel: config.storeModel,
                                            "storeId": "page",
                                            "labelAttribute": "name",
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ]

                                        },
                                        {
                                            "factoryId": "gform-app/factory/ExtendedGridFactory",
                                            "gridxQueryTransform": new ToMongoQueryTransform(),
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
                                },
                                {
                                    "factoryId": "gform-app/factory/TabFactory",
                                    "storeId": "file",
                                    "children": [
                                        {
                                            "factoryId": "gform-app/factory/TreeFactory",
                                            "title": "tree",
                                            // for local storage "osm": true,
                                            storeModel: config.storeModel,
                                            "storeId": FILE_STORE,
                                            "labelAttribute": "name",
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ]

                                        },
                                        {
                                            "factoryId": "gform-app/factory/GridFactory",
                                            "title": "files",
                                            "storeId": FILE_STORE,
                                            "gridxQueryTransform": new ToMongoQueryTransform(),
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ],
                                            "columns": [
                                                {
                                                    "id": "path",
                                                    "field": "path",
                                                    "name": "path"
                                                },
                                                {
                                                    "id": "contentMode",
                                                    "field": "contentMode",
                                                    "name": "contentMode"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
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
                                    "partialStore": PARTIAL_STORE,
                                    "fileStore": FILE_STORE,
                                    "urlProperty": "path",
                                    "libBasePath":config.libBasePath
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

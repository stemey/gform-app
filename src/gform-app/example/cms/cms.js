define([

        'gform/util/Resolver',
        '../../controller/tools/Link',
        '../../cms/createValueFactory',
        '../../controller/gridactions/Delete',
        '../../controller/gridactions/OpenAsJson',
        '../../jcr/TemplateStore',
        '../../util/ToMongoQueryTransform',
        "dojo/text!./binary.json",
        "dojo/text!./text.json",
        "dojo/text!../../file/types.json",
        '../../util/LoadRichtextPlugins'
    ], function (Resolver, Link, createValueFactory, Delete, OpenAsJson, TemplateStore, ToMongoQueryTransform, binarySchema, textSchema, types) {




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


        return function (config) {

            if (!config) {
                config = {}
            }
            if (!config.idProperty) {
                config.idProperty = "id";
                config.idType = "number"
            }


            var baseUrl = config.baseUrl;
            return {
                "storeRegistry": {
                    "stores": [
                        {
                            "factoryId": "gform-app/factory/StoreFactory",
                            "name": FILE_SCHEMA_STORE,
                            "storeClass": "dojo/store/Memory",
                            "idProperty": "id",
                            "data": [text, JSON.parse(binarySchema)]
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "gform-app/util/LocalStorage",
                            "templateStore": FILE_SCHEMA_STORE,
                            "name": "file",
                            "typeProperty": "mediaType",
                            "idProperty": "path",
                            "idType": "string",
                            "assignableId": true,
                            "dstoreConfig": {
                                "version": "1.1",
                                "storeName": FILE_STORE
                            },
                            "initialDataUrl": "gform-app/example/cms/data/file-data.json",
                            "createEditorFactory": "gform-app/example/cms/createFileEditorFactory"
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "gform-app/util/LocalStorage",
                            "template": TEMPLATE_SCHEMA,
                            "name": TEMPLATE_STORE,
                            "idProperty": config.idProperty,
                            "instanceStore": "page",
                            "idType": "string",
                            "assignableId": true,
                            "dstoreConfig": {
                                "version": "1.1",
                                "storeName": TEMPLATE_STORE
                            },
                            "initialDataUrl": "gform-app/example/cms/data/template-data.json",
                            "createEditorFactory": "gform-app/example/cms/createTemplateEditorFactory"
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "gform-app/util/LocalStorage",
                            "template": TEMPLATE_SCHEMA,
                            "name": PARTIAL_STORE,
                            "idProperty": config.idProperty,
                            "idType": "string",
                            "assignableId": true,
                            "dstoreConfig": {
                                "version": "1.1",
                                "storeName": PARTIAL_STORE
                            },
                            "initialDataUrl": "gform-app/example/cms/data/partial-data.json",
                            "createEditorFactory": "gform-app/example/cms/createPartialTemplateEditorFactory"
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "gform-app/util/LocalStorage",
                            "templateStore": TEMPLATE_STORE,
                            "name": PAGE_STORE,
                            "previewerId": "handlebars",
                            "typeProperty": "template",
                            "parentProperty": "parent",
                            "idType": "number",// used by createValueFactory
                            "idProperty": config.idProperty,
                            "initialDataUrl": "gform-app/example/cms/data/page-data.json",
                            "dstoreConfig": {
                                "version": "1.1",
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
                        {id: FILE_SCHEMA_STORE},
                        {id: TEMPLATE_STORE, storeClass: TemplateStore, idProperty: config.idProperty},
                        {id: PARTIAL_STORE, storeClass: TemplateStore, idProperty: config.idProperty}
                    ],
                    "schemaGenerators": [
                        {
                            "factoryId": "gform-app/factory/schema/SchemaFactory",
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
                            "module": "gform-app/example/cms/fallbackSchema.json"
                        }
                    ]
                },
                "resourceFactories": [],
                "view": {
                    "startPath": "/entity/page/0.43755838507786393",
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
                                            "osm": true,
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
                                    "fileStore": FILE_STORE,
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

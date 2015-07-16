define([
        '../../factory/ExtendedGridFactory',
        'dstore/db/LocalStorage',
        'dojo/text!./storeDescription.html',
        'dojo/text!./schemaDescription.html',
        '../../controller/gridactions/OpenAsJson',
        'dstore/Memory',
        '../../util/dynamicDstoreFactory',
        '../../dynamicstore/SchemaStore',
        '../../util/ToMongoQueryTransform',
        'gform-app/controller/gridactions/Delete'], function (ExtendedGridFactory, LocalStorage, storeDescription, schemaDescription, OpenAsJson, Memory, dynamicDstoreFactory, SchemaStore, ToMongoQueryTransform, Delete) {


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
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "dstore/db/LocalStorage",
                            "template": "schema",
                            "name": "schema",
                            "idProperty": config.idProperty,
                            "idType": config.idType,
                            "assignableId": false,
                            "dstoreConfig": {
                                "storeName": "schema"
                            },
                            "initialDataUrl": "gform-app/example/dynamic/data/schema-data.json",
                            "createEditorFactory": "gform-app/dynamicstore/createSchemaEditorFactory",
                            "description": schemaDescription
                        },
                        {
                            "factoryId": "gform-app/factory/DstoreFactory",
                            "storeClass": "dstore/db/LocalStorage",
                            "template": "metadata",
                            "name": "metadata",
                            "idProperty": config.idProperty,
                            "dstoreConfig": {
                                "storeName": "metadata"
                            },
                            "initialDataUrl": "gform-app/example/dynamic/data/metadata-data.json",
                            "createEditorFactory": "gform-app/dynamicstore/createMetadataEditorFactory",
                            "efConfig": {
                                "idProperty": config.idProperty,
                                "idType": config.idType
                            },
                            "description": storeDescription
                        }
                    ]
                },
                "schemaRegistry": {
                    "factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
                    "registryClass": "gform-app/SchemaRegistry",
                    "stores": [
                        {id: "schema", storeClass: SchemaStore, idProperty: config.idProperty}
                    ],
                    "schemaGenerators": [
                        {
                            "factoryId": "gform-app/example/dynamic/MetaSchemaFactory",
                            "store": "schema",
                            "schemaId": "schema"

                        },
                        {
                            "factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
                            "module": "gform-app/example/dynamic/metadata.json"
                        },
                        {
                            "factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
                            "module": "gform-app/example/dynamic/fallbackSchema.json"
                        }
                    ]
                },
                "resourceFactories": [
                    {
                        "factoryId": "gform-app/factory/DynamicResourceFactory",
                        "storeFactory": dynamicDstoreFactory,
                        "idProperty": config.idProperty,
                        "initialDataUrl": "gform-app/example/dynamic/data/data-{store}.json",
                        "storeConfig": {
                            "storeClass": LocalStorage
                        },
                        "storeId": "metadata",
                        "schemaStore": "schema",
                        "fallbackSchema": "fallbackSchema",
                        "createEditorFactory": "gform-app/mongodb/createEditorFactory"
                    }
                ],
                "view": {
                    "layouts": {
                        "standard": {
                            "store": {"region": "left", "width": "50%"},
                            "entity": {"region": "center"}
                        }
                    },
                    "views": [
                        {
                            "region": "top",
                            "factoryId": "gform-app/factory/ToolbarFactory",
                            "children": [
                                {
                                    "factoryId": "gform-app/factory/BrandFactory",
                                    "label": "dynamic"
                                },
                                {
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "iconClass": "fa fa-plus"
                                },
                                {
                                    "factoryId": "gform-app/factory/SelectViewFactory",
                                    "label": "view"
                                },
                                {
                                    "factoryId": "gform-app/factory/tools/HelpFactory",
                                    "label": "help",
                                    "iconClass": "fa fa-question-circle"
                                }
                            ]
                        },
                        {
                            "region": "left",
                            "splitter": true,
                            "appType": "store",
                            "width": "400px",
                            "factoryId": "gform-app/factory/StoreViewFactory",
                            "controllers": [
                                {
                                    "controllerClass": "gform-app/factory/StoreViewController",
                                    "storeId": "metadata",
                                    "schemaStoreId": "schema",
                                    //"groupProperty": "db",
                                    "factory":new ExtendedGridFactory(),
                                    "gridConfig": {
                                        "gridxQueryTransform": new ToMongoQueryTransform(),
                                        "menuItems": [
                                            Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                        ]
                                    }
                                }],
                            "children": [
                                {
                                    "factoryId": "gform-app/factory/GridFactory",
                                    "title": "store",
                                    "storeId": "metadata",
                                    "gridxQueryTransform": new ToMongoQueryTransform(),
                                    "menuItems": [
                                        Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
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
                                },
                                {
                                    "factoryId": "gform-app/factory/GridFactory",
                                    "title": "schema",
                                    "storeId": "schema",
                                    "gridxQueryTransform": new ToMongoQueryTransform(),
                                    "menuItems": [
                                        Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
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
                        },
                        {
                            "width": "100%",
                            "region": "center",
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

define([
        'gform/util/Resolver',
        '../../util/ToMongoQueryTransform',
        '../../controller/gridactions/OpenAsJson',
        'gform-app/controller/gridactions/Delete',
        "dojo/text!../../file/types.json",
        'dojo/text!./binary.json',
        'dojo/text!./text.json',
        'dojo/text!./folder.json'
    ], function (Resolver, ToMongoQueryTransform, OpenAsJson, Delete, types, binarySchema, textSchema, folderSchema) {


        return function (config) {

            var store;
            var FILE_SCHEMA_STORE = "fileSchemaStore";
            var rootPath;
            if (config.local) {
                rootPath = "";
                store = {
                    "factoryId": "gform-app/factory/StoreFactory",
                    "storeClass": "gform-app/github/GithubStoreMock",
                    "name": "github",
                    "encoded": false,
                    "initialDataUrl": "gform-app/example/github/data.json",
                    "templateStore": FILE_SCHEMA_STORE,
                    "typeProperty": "mediaType",
                    "createEditorFactory": "gform-app/github/createFileEditorFactory",
                    "idProperty": "path",
                    "typeProperty": "mediaType",
                    "changeableId": true,
                    "root": "src"
                }
            } else {
                rootPath = "";
                store = {
                    "factoryId": "gform-app/factory/StoreFactory",
                    "name": "github",
                    "storeClass": "gform-app/github/GithubStore",
                    "owner": config.owner,
                    "repo": config.repo,
                    "idProperty": "path",
                    "accessToken": config.accessToken,
                    "templateStore": FILE_SCHEMA_STORE,
                    "typeProperty": "mediaType",
                    "createEditorFactory": "gform-app/github/createFileEditorFactory",
                    "changeableId": true,
                    "root": ""
                }
            }

            var baseUrl = config.baseUrl;


            var textMappings = JSON.parse(types).types.filter(function (mapping) {
                return mapping.type == "text" && mapping.ace;
            }).map(function (mapping) {
                return {label: mapping.name, value: mapping.ace};
            });
            var text = {};
            new Resolver({values: {textMappings: textMappings}}).resolve(JSON.parse(textSchema)).then(function (schema) {
                text = schema;
            });
            return {
                "storeRegistry": {
                    "stores": [
                        store,
                        {
                            "factoryId": "gform-app/factory/StoreFactory",
                            "name": FILE_SCHEMA_STORE,
                            "storeClass": "dojo/store/Memory",
                            "idProperty": "id",
                            "data": [text, JSON.parse(binarySchema), JSON.parse(folderSchema)]
                        }
                    ]
                },
                "schemaRegistry": {
                    "factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
                    "registryClass": "gform-app/SchemaRegistry",
                    "stores": [
                        {id: FILE_SCHEMA_STORE}
                    ],
                    "schemaGenerators": [
                        {
                            "factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
                            "module": "gform-app/example/github/fallbackSchema.json"
                        }
                    ]
                },
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
                                    "label": "static"
                                },
                                {
                                    "factoryId": "gform-app/factory/SingleSchemaCreateFactory",
                                    "label": "add",
                                    "iconClass": "fa fa-plus"
                                },
                            ]
                        },
                        {

                            "region": "left",
                            "splitter": true,
                            "appType": "store",
                            "width": "400px",
                            "factoryId": "gform-app/factory/StoreViewFactory",
                            "children": [
                                {
                                    "factoryId": "gform-app/factory/TabFactory",
                                    "storeId": "github",
                                    "children": [
                                        {
                                            "factoryId": "gform-app/factory/TreeFactory",
                                            "title": "tree",
                                            "gh": {"root": rootPath},
                                            "storeId": "github",
                                            "labelAttribute": "path",
                                            "menuItems": [
                                                Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
                                            ]

                                        },
                                        {
                                            "factoryId": "gform-app/factory/ExtendedGridFactory",
                                            "gridxQueryTransform": new ToMongoQueryTransform(),
                                            "title": "grid",
                                            "storeId": "github",
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
                                                    "id": "path",
                                                    "field": "path",
                                                    "name": "path"
                                                }
                                            ],
                                            sync: false,
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

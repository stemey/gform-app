define([
    '../factory/CreateFactory',
    '../factory/BrandFactory',
    '../factory/ToolbarFactory',
    '../factory/GridFactory',
    '../factory/TabFactory',
    '../factory/PreviewerFactory',
    '../factory/TreeFactory'
], function () {

        return {
            "storeRegistry": {
                "stores": [
                    {
                        "factoryId": "cms/factory/StoreFactory",
                        "storeClass": "cms/util/JsonRest",
                        "name": "/pagetree",
                        "target": "http://localhost:8080/tree/",
                        "idProperty": "id"
                    },
                    {
                        "factoryId": "cms/factory/StoreFactory",
                        "name": "/page",
                        "storeClass": "cms/util/JsonRest",
                        "idProperty": "identifier",
                        "idType": "string",
                        "target": "http://localhost:8080/entity/base/"
                    },
                    {
                        "factoryId": "cms/factory/StoreFactory",
                        "name": "/template",
                        "storeClass": "cms/util/JcrTemplateRest",
                        "idProperty": "code",
                        "idType": "string",
                        "target": "http://localhost:8080/schema/"

                    }
                ]
            },
            "schemaRegistry":{
                "factoryId":"cms/factory/schema/SchemaRegistryFactory",
                "registryClass":"cms/SchemaRegistry",
                "storeId":"/template"
            },
            "views": [
                {
                    "region": "top",
                    "factoryId": "cms/factory/ToolbarFactory",
                    "children": [
                        {
                            "factoryId": "cms/factory/BrandFactory",
                            "label": "mini cms"
                        },
                        {
                            "factoryId": "cms/factory/CreateFactory",
                            "storeId": "/template",
                            "label": "+"
                        },
                        {
                            "factoryId": "cms/factory/CreateFactory",
                            "url": "/template",
                            "schemaUrl": "/template",
                            "label": "+ template"
                        },
                        {
                            "factoryId": "cms/factory/ToggleSizeFactory",
                            "label": "full size"
                        }
                    ]
                },
                {
                    "region": "left",
                    "splitter": true,
                    "factoryId": "cms/factory/TabFactory",
                    "children": [
                        {
                            "factoryId": "cms/factory/TreeFactory",
                            "title": "tree",
                            "storeId": "/pagetree",
                            "labelAttribute": "name"

                        },
                        {
                            "factoryId": "cms/factory/GridFactory",
                            "title": "template",
                            "storeId": "/template",
                            "columns": [
                                {
                                    "id": "name",
                                    "field": "name",
                                    "name": "name"
                                }
                            ]
                        }
                    ]
                },
                {
                    "region": "center",
                    "factoryId": "cms/factory/PreviewerFactory",
                    "splitter": true
                },
                {
                    "width": "40%",
                    "region": "right",
                    "factoryId": "cms/factory/TabOpenerFactory",
                    "splitter": true
                }
            ]

        }
    }
);

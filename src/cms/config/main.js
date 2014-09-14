define([
    '../factory/GridFactory',
    '../factory/TabFactory',
    '../factory/PreviewerFactory',
    '../factory/TreeFactory'
], function () {

    return [
        {
            "region":"top",
            "factoryId":"cms/factory/ToolbarFactory"
        },
        {
            "region":"left",
            "splitter": true,
            "factoryId":"cms/factory/TabFactory",
            "children": [
                {
                    "factoryId":"cms/factory/TreeFactory",
                    "title":"tree",
                    "storeId":"/pagetree",
                    "labelAttribute":"name"

                },
                {
                    "factoryId":"cms/factory/GridFactory",
                    "title":"template",
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
            "region":"center",
            "factoryId":"cms/factory/PreviewerFactory",
            "splitter": true
        },
        {
            "width":"40%",
            "region":"right",
            "factoryId":"cms/factory/TabOpenerFactory",
            "splitter": true
        }
    ]


});

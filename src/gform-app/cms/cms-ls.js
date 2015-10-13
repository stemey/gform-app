define([
    './cms',
    './LoadRichtextPlugins'
], function (cms) {

    var TEMPLATE_STORE = "/template";
    var PARTIAL_STORE = "partial";
    var FILE_STORE = "file";
    var FILE_SCHEMA_STORE = "fileSchemaStore";

    var PAGE_STORE = "page";

    return function (config) {
        if (!config) {
            config = {}
        }
        if (!config.idProperty) {
            config.idProperty = "id";
            config.idType = "number"
        }

            config.storeModel = {type: "osm"};

        config.startPath = "/entity/page/0.43755838507786393";

        var stores = [
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
                }
                ,
                "initialDataUrl": "gform-app/example/cms/data/file-data.json",
                "createEditorFactory": "gform-app/cms/createFileEditorFactory"
            }
            ,
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
                }
                ,
                "initialDataUrl": "gform-app/example/cms/data/template-data.json",
                "createEditorFactory": "gform-app/cms/createTemplateEditorFactory"
            }
            ,
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
                }
                ,
                "initialDataUrl": "gform-app/example/cms/data/partial-data.json",
                "createEditorFactory": "gform-app/cms/createPartialTemplateEditorFactory"
            }
            ,
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
                }
                ,
                "createEditorFactory": "gform-app/cms/createPageEditorFactory"
            }]


        return cms(config, stores);
    }

})

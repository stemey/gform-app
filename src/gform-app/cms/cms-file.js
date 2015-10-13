define([
    '../filestore/JsonConverter',
    '../filestore/FileConverter',
    './cms',
    './LoadRichtextPlugins'
], function (JsonConverter, FileConverter, cms) {

    var TEMPLATE_STORE = "/template";
    var PARTIAL_STORE = "partial";
    var FILE_STORE = "file";
    var FILE_SCHEMA_STORE = "fileSchemaStore";

    var PAGE_STORE = "page";

    var FILE_TARGET = "http://localhost:8080/";
    var FILE_KEY = "12345";

    return function (config) {


        if (!config) {
            config = {}
        }
        if (!config.idProperty) {
            config.idProperty = "path";
            config.idType = "string"
        }
         config.storeModel = {type: "gh", "root": {path: "", name: "root"}}

        var stores = [
            {
                "factoryId": "gform-app/factory/StoreFactory",
                "storeClass": "gform-app/fileStore/FileStore",
                "converter": new FileConverter({typeProperty: "mediaType", folderType:"folder"}),
                "templateStore": FILE_SCHEMA_STORE,
                "name": "file",
                "typeProperty": "mediaType",
                "idProperty": "path",
                "idType": "string",
                "assignableId": true,
                "target": FILE_TARGET,
                "baseDir": "file",
                "key": FILE_KEY,
                "createEditorFactory": "gform-app/cms/createFileEditorFactory"

            }
            ,
            {
                "factoryId": "gform-app/factory/StoreFactory",
                "storeClass": "gform-app/fileStore/FileStore",
                "converter": new JsonConverter({}),
                "template": TEMPLATE_SCHEMA,
                "name": TEMPLATE_STORE,
                "idProperty": config.idProperty,
                "instanceStore": "page",
                "idType": "string",
                "assignableId": true,
                "target": FILE_TARGET,
                "baseDir": "template",
                "key": FILE_KEY,
                "createEditorFactory": "gform-app/cms/createTemplateEditorFactory",
                jsonContent: true
            }
            ,
            {
                "factoryId": "gform-app/factory/StoreFactory",
                "storeClass": "gform-app/fileStore/FileStore",
                "converter": new JsonConverter({}),
                "template": TEMPLATE_SCHEMA,
                "name": PARTIAL_STORE,
                "idProperty": config.idProperty,
                "idType": "string",
                "assignableId": true,
                "target": FILE_TARGET,
                "baseDir": "partial",
                "key": FILE_KEY,
                "createEditorFactory": "gform-app/cms/createPartialTemplateEditorFactory",
                jsonContent: true
            }
            ,
            {
                "factoryId": "gform-app/factory/StoreFactory",
                "storeClass": "gform-app/fileStore/FileStore",
                "converter": new JsonConverter({
                    typeProperty: "template",
                    folderType: "/folder.json",
                    pathProperty: config.idProperty
                }),
                "templateStore": TEMPLATE_STORE,
                "name": PAGE_STORE,
                "previewerId": "handlebars",
                "typeProperty": "template",
                "parentProperty": "parent",
                "idType": "string",// used by createValueFactory
                "changeableId": true,
                "idProperty": config.idProperty,
                "target": FILE_TARGET,
                "baseDir": "page",
                "key": FILE_KEY,
                "folderType": "/folder.json",
                "createEditorFactory": "gform-app/cms/createPageEditorFactory",
                jsonContent: true
            }]


        return cms(config, stores);
    }

})

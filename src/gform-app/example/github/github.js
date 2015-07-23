define(['../../controller/gridactions/OpenAsJson',
        'gform-app/controller/gridactions/Delete'], function (OpenAsJson, Delete) {


		return function (config) {
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "gform-app/factory/StoreFactory",
                            "name":"github",
							"storeClass": "gform-app/github/GithubStore",
							"owner": config.owner,
							"repo": config.repo,
							"idProperty": "path",
                            "accessToken":config.accessToken,
                            "template":"file",
                            "createEditorFactory": "gform/createFullEditorFactory"

						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"schemaGenerators": [
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/example/github/schema.json"
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

                                    "factoryId": "gform-app/factory/TreeFactory",
                                    "title": "tree",
                                    "gh": true,
                                    "storeId": "github",
                                    "labelAttribute": "path",
                                    "menuItems": [
                                        Delete, {type: OpenAsJson, fallbackSchema: "fallbackSchema"}
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

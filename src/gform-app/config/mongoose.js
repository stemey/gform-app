define([
        '../controller/gridactions/Delete',
		'../controller/gridactions/OpenAsJson',
        '../util/ToMongoQueryTransform',
		'../factory/ExtendedGridFactory',
		'dojo/store/JsonRest',
		'../factory/HandlebarsCreateFactory',
		'../factory/ToggleSizeFactory',
		'../factory/FindPageFactory',
		'../factory/MultiSchemaCreateFactory',
		'../factory/BrandFactory',
		'../factory/ToolbarFactory',
		'../factory/GridFactory',
		'../factory/TabFactory',
		'../factory/PreviewerFactory',
		'../factory/TreeFactory',
		"../factory/StoreViewFactory",
		"../factory/SingleSchemaCreateFactory",
		"dijit/_editor/plugins/FullScreen",
		"dijit/_editor/plugins/AlwaysShowToolbar",
		"dojox/editor/plugins/ShowBlockNodes",
		"dojox/editor/plugins/FindReplace",
		"dojox/editor/plugins/LocalImage",
		"dijit/_editor/plugins/LinkDialog",
		"dijit/_editor/plugins/ToggleDir",
		"dijit/_editor/plugins/FontChoice",
		"dijit/_editor/plugins/TextColor",
		"dijit/_editor/plugins/ViewSource",
		"dijit/_editor/plugins/Print"
	], function (Delete, OpenAsJson, ToMongoQueryTransform) {


		return function (config) {
			config.idProperty="_id";
			config.idType="string";
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					stores:[]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"stores": [],
					"schemaGenerators": []
				},
				"resourceFactories": [
					{
						"factoryId": "gform-app/factory/ResourceFactory",
						"apiUrl": "http://localhost:3333/api/gform",
						"storeId":"meta",
						"idProperty":"_id",
						"storeClass":"gform-app/baucis/BaucisStore",
						"createEditorFactory":"gform-app/baucis/createEditorFactory"

					}
				],
				"view": {
					"startPath": "",
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
									"label": "mongoose admin"
								},
								{
									"factoryId": "gform-app/factory/SelectViewFactory",
									"label": "view"
								},
								{
									"factoryId": "gform-app/factory/SingleSchemaCreateFactory",
									"label": "add",
									"iconClass": "fa fa-plus"
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
									"controllerClass": "gform-app/factory/StaticStoreViewController",
									"storeId": "meta",
									//"groupProperty": "db",
									"gridConfig": {
                                        "sync":false,
										"gridxQueryTransform": new ToMongoQueryTransform(),
										"menuItems": [
											OpenAsJson, Delete
										]
									}
								}],
							"children": []
						},
						{
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

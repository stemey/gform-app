define(['../../util/ToMongoQueryTransform',
		'../../controller/gridactions/OpenAsJson',
		'gform-app/controller/gridactions/Delete'], function (ToMongoQueryTransform, OpenAsJson, Delete) {


		return function (config) {
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "gform-app/factory/DstoreFactory",
							"storeClass": "dstore/RequestMemory",
							"template": "static",
							"name": "static",
							"idProperty": "id",
							"dstoreConfig": {
								"target": "gform-app/example/static/data.json"
							}
						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"schemaGenerators": [
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/example/static/schema.json"
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
									"factoryId": "gform-app/factory/GridFactory",
									"title": "static",
									"storeId": "static",
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"menuItems": [
										Delete
									],
									sync:true,
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

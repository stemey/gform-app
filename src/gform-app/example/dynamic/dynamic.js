define(['dstore/Memory',
		'dstore/RequestMemory',
		'../../util/dynamicDstoreFactory',
		'../../mongodb/MdbSchemaStore',
		'../../util/ToMongoQueryTransform',
		'gform-app/controller/gridactions/Delete'], function (Memory, RequestMemory, dynamicDstoreFactory, MdbSchemaStore, ToMongoQueryTransform, Delete) {


		return function (config) {
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "gform-app/factory/DstoreFactory",
							"storeClass": "dstore/Memory",
							"template": "schema",
							"name": "schema",
							"idProperty": "id",
							"idType":"number",
							"assignableId":false,
							"dstoreConfig": {
								//"target": "gform-app/example/dynamic/schema-data.json"
							}
						},
						{
							"factoryId": "gform-app/factory/DstoreFactory",
							"storeClass": "dstore/RequestMemory",
							"template": "metadata",
							"name": "metadata",
							"idProperty": "id",
							"dstoreConfig": {
								"target": "gform-app/example/dynamic/metadata-data.json"
							}
						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"stores": [
						{id: "schema", storeClass: MdbSchemaStore}
					],
					"schemaGenerators": [
						{
							"factoryId": "gform-app/mongodb/MetaSchemaGenerator",
							"store": "schema"
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
						"idProperty": "id",
						"storeConfig": {
							"storeClass": Memory
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
									"label": "static"
								},
								{
									"factoryId": "gform-app/factory/MultiSchemaCreateFactory",
									"label": "+",
									"searchProperty": "name",
									"placeHolder": "add entity.."
								},
								{
									"factoryId": "gform-app/factory/SingleSchemaCreateFactory",
									"label": "add",
									"iconClass": "fa fa-plus"
								},
								{
									"factoryId": "gform-app/factory/SelectViewFactory",
									"label": "view"
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
									"gridConfig": {
										"gridxQueryTransform": new ToMongoQueryTransform(),
										"menuItems": [
											 Delete
										]
									}
								}],
							"children": [
								{
									"factoryId": "gform-app/factory/GridFactory",
									"title": "metadata",
									"storeId": "metadata",
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"menuItems": [
										Delete
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
										Delete
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

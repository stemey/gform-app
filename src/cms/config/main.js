define([
		'cms/preview/handlebars/Renderer',
		'cms/factory/BrandFactory',
		'cms/factory/FindPageFactory',
		'cms/factory/ToggleSizeFactory',
		'cms/factory/HandlebarsCreateFactory',
		'cms/factory/SingleSchemaCreateFactory',
		'cms/factory/MultiSchemaCreateFactory',
		'cms/factory/ToolbarFactory',
		'cms/factory/GridFactory',
		'cms/factory/ResourceGridFactory',
		'cms/factory/PreviewerFactory',
		'cms/factory/TabOpenerFactory',
		'../factory/SingleStoreGridFactory',
		'dojo/store/JsonRest',
		'../factory/HandlebarsCreateFactory',
		'cms/preview/handlebars/Renderer',
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
		"../factory/SingleSchemaCreateFactory"
	], function (Renderer, BrandFactory, FindPageFactory, ToggleSizeFactory, HandlebarsCreateFactory, SingleSchemaCreateFactory, MultiSchemaCreateFactory, ToolbarFactory, GridFactory, ResourceGridFactory, PreviewerFactory, TabOpenerFactory) {

		return {
			"storeRegistry": {
				"stores": [
					{
						"factoryId": "cms/factory/StoreFactory",
						"storeClass": "cms/util/JsonRest",
						"name": "/pagetree",
						"target": "http://localhost:8080/tree/",
						"idProperty": "id",
						"mainStore": "/page"
					},
					{
						"factoryId": "cms/factory/StoreFactory",
						"name": "/page",
						"storeClass": "cms/util/JsonRest",
						"templateStore": "/template",
						"idProperty": "identifier",
						"idType": "string",
						"typeProperty": "template",
						"target": "http://localhost:8080/entity/base/",
						"createEditorFactory": "cms/createBuilderEditorFactory"
					},
					{
						"factoryId": "cms/factory/StoreFactory",
						"name": "/template",
						"storeClass": "cms/util/JcrTemplateRest",
						"idProperty": "code",
						"idType": "string",
						"target": "http://localhost:8080/schema/",
						"template": "/template",
						"instanceStore": "/page",
						"createEditorFactory": "cms/createBuilderEditorFactory",
						"plainValueFactory": "cms/default/createTemplateValueFactory"

					},
					{
						"factoryId": "cms/factory/StoreFactory",
						"name": "/mdbcollection",
						"storeClass": "cms/util/MongoRest",
						"idProperty": "_id",
						"idType": "string",
						"target": "http://localhost:3001/meta/",
						"template": "/mdbcollection",
						"createEditorFactory": "cms/mongodb/createSchemaEditorFactory"//,
						//"plainValueFactory": "cms/default/createTemplateValueFactory"

					},
					{
						"factoryId": "cms/factory/StoreFactory",
						"name": "/mdbschema",
						"storeClass": "cms/util/MongoRest",
						"idProperty": "_id",
						"idType": "string",
						"target": "http://localhost:3001/collections/mdbschema/",
						"template": "/mdbschema",
						"createEditorFactory": "cms/mongodb/createSchemaEditorFactory",
						"efConfig": {
							"fileserver-upload": "http://localhost:4444/upload",
							"fileserver-download": "http://localhost:4444/"
						},
						"plainValueFactory": "cms/mongodb/defaultSchemaFactory"

					}
				]
			},
			"schemaRegistry": {
				"factoryId": "cms/factory/schema/SchemaRegistryFactory",
				"registryClass": "cms/SchemaRegistry",
				"stores": ["/template", "/mdbschema"],
				"schemaGenerators": [
					{
						"factoryId": "cms/factory/schema/SchemaGenerator",
						"store": "/template" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
					},
					{
						"factoryId": "cms/mongodb/MdbSchemaGenerator",
						"store": "/mdbschema" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
					},
					{
						"factoryId": "cms/factory/schema/StaticSchemaGenerator",
						"module": "cms/schema/mdbcollection.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
					},
					{
						"factoryId": "cms/factory/schema/StaticSchemaGenerator",
						"module": "cms/schema/mdbFallbackSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
					}
				]
			},
			"resourceFactories": [
				{
					"factoryId": "cms/factory/ResourceFactory",
					"apiUrl": "http://localhost:3333/api/gform",
					"storeClass": "cms/util/BaucisStore"
				},
				{
					"factoryId": "cms/factory/DynamicResourceFactory",
					"storeClass": "cms/util/MongoRest",
					"baseUrl": "http://localhost:3001/collections/",
					"storeId": "/mdbcollection",
					"schemaStore": "/mdbschema",
					"idProperty": "_id",
					"fallbackSchema":"/mdbFallbackSchema",
					"createEditorFactory": "cms/mongodb/createEditorFactory",
					"efConfig": {
						"fileserver-upload": "http://localhost:4444/upload",
						"fileserver-download": "http://localhost:4444/"
					}
				}
			],
			"views": [
				{
					"region": "top",
					"factoryId": "cms/factory/ToolbarFactory",
					"children": [
						{
							"factoryId": "cms/factory/BrandFactory",
							"label": "gform-cms"
						},
						{
							"factoryId": "cms/factory/FindPageFactory",
							"storeId": "/page",
							"label": "open",
							"searchProperty": "url",
							"labelProperty": "url",
							"placeHolder": "find page ..",
							"includedStoreIds": ["/page"]
						},
						{
							"factoryId": "cms/factory/MultiSchemaCreateFactory",
							"label": "+",
							"searchProperty": "name",
							"placeHolder": "find template .."
						},
						{
							"factoryId": "cms/factory/SingleSchemaCreateFactory",
							"label": "add",
							"excludedStoreIds": ["/template"]
						},
						{
							"factoryId": "cms/factory/HandlebarsCreateFactory",
							"url": "/template",
							"storeId": "/template",
							"label": "add template",
							"includedStoreIds": ["/template"]
						},
						{
							"factoryId": "cms/factory/ToggleSizeFactory",
							"label": "full size",
							"includedStoreIds": ["/page"]
						}
					]
				},
				{
					"region": "left",
					"splitter": true,
					"width": "400px",
					"factoryId": "cms/factory/StoreViewFactory",
					"controllers": [
						{
							"controllerClass": "cms/factory/StoreViewController",
							"storeId": "/mdbcollection",
							"schemaStoreId": "/mdbschema"
						}
					],
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
						},
						{
							"factoryId": "cms/factory/GridFactory",
							"title": "mdb collection",
							"storeId": "/mdbcollection",
							"columns": [
								{
									"id": "name",
									"field": "name",
									"name": "name"
								}, {
									"id": "id",
									"field": "_id",
									"name": "id"
								}
							]
						},
						{
							"factoryId": "cms/factory/GridFactory",
							"title": "mdb schema",
							"storeId": "/mdbschema",
							"columns": [
								{
									"id": "name",
									"field": "name",
									"name": "name"
								}, {
									"id": "id",
									"field": "_id",
									"name": "id"
								}
							]
						},
						{
							"factoryId": "cms/factory/ResourceGridFactory",
							"storeIds": ["./Users/", "./BlogPosts/", "./Products/"]// TODO this should not be configured
						}
					]
				},
				{
					"region": "center",
					"factoryId": "cms/factory/PreviewerFactory",
					"splitter": true,
					"rendererClass": "cms/preview/handlebars/Renderer",
					"pageStore": "/page"
				},
				{
					"width": "35%",
					"region": "right",
					"factoryId": "cms/factory/TabOpenerFactory",
					"splitter": true
				}
			]

		}
	}
);

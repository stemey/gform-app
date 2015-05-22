define([
		'../mongodb/SchemaGenerator',
		'../factory/tools/HelpFactory',
		'../factory/SelectViewFactory',
		'../factory/BrandFactory',
		'../mongodb/createEditorFactory',
		'../factory/DynamicResourceFactory',
		'../dynamicstore/MetaSchemaGenerator',
		'../factory/schema/StaticSchemaGenerator',
		'../factory/schema/SchemaRegistryFactory',
		'../mongodb/createSchemaEditorFactory',
		'../mongodb/createCollectionEditorFactory',
		'../mongodb/createMdbServerEditorFactory',
		'../mongodb/MongoRest',
		'../util/JcrTemplateRest',
		'../factory/StoreFactory',
		'../util/JsonRest',
		'../controller/gridactions/Delete',
		'../controller/gridactions/OpenAsJson',
		'../dynamicstore/SchemaStore',
		'../jcr/TemplateStore',
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
	], function (SchemaGenerator, HelpFactory, SelectViewFactory, BrandFactory, createEditorFactory, DynamicResourceFactory, MetaSchemaGenerator, StaticSchemaGenerator, SchemaRegistryFactory, createSchemaEditorFactory, createCollectionEditorFactory, createMdbServerEditorFactory, MongoRest, JcrTemplateRest, StoreFactory, JsonRest, Delete, OpenAsJson, SchemaStore, TemplateStore, ToMongoQueryTransform) {


		return function (config) {
			config.idProperty="_id";
			config.idType="string";
			var schemaGenerator = new SchemaGenerator()
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"storeClass": "gform-app/util/JsonRest",
							"name": "documentation",
							"previewerId": "documentation",
							"target": "gform-app/documentation"
						},
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"name": "/mdbserver",
							"storeClass": "gform-app/util/MongoRest",
							"assignableId": true,
							"idProperty": "name",
							"idType": "string",
							"target": baseUrl + "db/",
							"template": "/mdbserver",
							"createEditorFactory": "gform-app/mongodb/createMdbServerEditorFactory"

						},
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"name": "/mdbcollection",
							"storeClass": "gform-app/util/MongoRest",
							"assignableId": true,
							"idProperty": config.idProperty,
							"idType": config.idType,
							"target": baseUrl + "meta/",
							"template": "/mdbcollection",
							"createEditorFactory": "gform-app/mongodb/createCollectionEditorFactory",
							"efConfig":config,
							"description": "Hallo"

						},
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"name": "/mdbschema",
							"assignableId": true,
							"storeClass": "gform-app/util/MongoRest",
							"idProperty": config.idProperty,
							"idType": config.idType,
							"target": baseUrl + "schema/",
							"template": "/mdbschema",
							"createEditorFactory": "gform-app/mongodb/createSchemaEditorFactory",
							"previewerId": "gform"
							/*						"efConfig": {
							 "fileserver-upload": "http://localhost:4444/upload",
							 "fileserver-download": "http://localhost:4444/"
							 }*/

						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"stores": [
						/*{id: "/template", storeClass: TemplateStore},*/
						{id: "/mdbschema", storeClass: SchemaStore, idProperty: config.idProperty}
					],
					"schemaGenerators": [
						{
							"factoryId": "gform-app/dynamicstore/MetaSchemaGenerator",
							"store": "/mdbschema", // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
							"schemaGenerator":schemaGenerator
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/schema/mdbcollection.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/schema/mdbserver.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/schema/mdbFallbackSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/schema/fallbackSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						}
					]
				},
				"resourceFactories": [
					{
						"factoryId": "gform-app/factory/DynamicResourceFactory",
						"storeClass": MongoRest,
						"url": baseUrl + "data/{db}/{collection}/",
						"storeId": "/mdbcollection",
						"schemaStore": "/mdbschema",
						"idProperty": config.idProperty,
						"fallbackSchema": "/mdbFallbackSchema",
						"createEditorFactory": "gform-app/mongodb/createEditorFactory"
					}
				],
				"view": {
					"layouts": {
						"standard": {
							"preview": {"region": "right", "hidden": true},
							"store": {"region": "left", "width": "50%"},
							"entity": {"region": "center"}
						},
						"/page": {
							preview: {region: "center"},
							store: {region: "left", "width": "200px"},
							entity: {region: "right", "width": "35%"}
						},
						"/mdbschema": {
							preview: {region: "center"},
							store: {region: "left", "width": "200px"},
							entity: {region: "right", "width": "50%"}
						},
						"documentation": {
							preview: {region: "center"},
							store: {region: "left", hidden: true},
							entity: {region: "right", hidden: true}
						}
					},
					"views": [
						{
							"region": "top",
							"factoryId": "gform-app/factory/ToolbarFactory",
							"children": [
								{
									"factoryId": "gform-app/factory/BrandFactory",
									"label": "mongomat"
								},
								{
									"factoryId": "gform-app/factory/SelectViewFactory",
									"label": "view"
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
									"iconClass": "fa fa-plus",
									"excludedStoreIds": ["/template", "/mdbserver"]
								},
								{
									"factoryId": "gform-app/factory/ToggleSizeFactory",
									"label": "full size",
									"includedStoreIds": ["/page"]
								},
								{
									"factoryId": "gform-app/factory/StoreLinkFactory",
									"label": "settings",
									"iconClass": "fa fa-cogs"
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
									"controllerClass": "gform-app/factory/StoreViewController",
									"storeId": "/mdbcollection",
									"schemaStoreId": "/mdbschema",
									"groupProperty": "db",
									"gridConfig": {
										"gridxQueryTransform": new ToMongoQueryTransform(),
										"menuItems": [
											OpenAsJson, Delete
										]
									}
								}],
							"children": [
								{
									"factoryId": "gform-app/factory/ExtendedGridFactory",
									"title": "collection",
									"storeId": "/mdbcollection",
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"columns": [
										{
											"id": "db",
											"field": "db",
											"name": "db"
										}, {
											"id": "collection",
											"field": "collection",
											"name": "collection"
										}, {
											"id": "name",
											"field": "name",
											"name": "name"
										}, {
											"id": "type",
											"formatter": function (entity) {
												return entity.schema ? entity.schema.schemaType : "";
											},
											"name": "type"
										}
									],
									"menuItems": [
										OpenAsJson, Delete
									]
								},
								{
									"factoryId": "gform-app/factory/ExtendedGridFactory",
									"title": "db",
									"storeId": "/mdbserver",
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"menuItems": [
										OpenAsJson
									]

								},
								{
									"factoryId": "gform-app/factory/GridFactory",
									"title": "schema",
									"storeId": "/mdbschema",
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"columns": [
										{
											"id": "name",
											"field": "name",
											"name": "name"
										}
									],
									"menuItems": [
										OpenAsJson, Delete
									]
								}
							]
						},
						{
							"region": "center",
							"appType": "preview",
							"factoryId": "gform-app/factory/PreviewDispatcherFactory",
							"splitter": true,
							"children": [
								{
									"previewerId": "gform",
									"region": "center",
									"idProperty":"_id",
									"factoryId": "gform-app/factory/SchemaPreviewerFactory",
									"splitter": true
								},
								{
									"previewerId": "documentation",
									"region": "center",
									"factoryId": "gform-app/factory/DocumentationPreviewerFactory",
									"splitter": true
								}
							]
						},
						{
							"width": "45%",
							"region": "right",
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

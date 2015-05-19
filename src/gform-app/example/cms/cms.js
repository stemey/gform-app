define([
		'./SchemaGenerator',
		'../../jcr/TemplateStore',
		'../../util/ToMongoQueryTransform'
	], function (SchemaGenerator, TemplateStore, ToMongoQueryTransform) {


		// id of store and schema for templates must be /template. Fixed by template.json
		var TEMPLATE_STORE = TEMPLATE_SCHEMA = "/template";

		var PAGE_STORE = "page";

		return function (config) {

			if (!config) {
				config = {}
			}
			if (!config.idProperty) {
				config.idProperty = "id";
				config.idType = "number"
			}
			var schemaGenerator = new SchemaGenerator();
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "gform-app/factory/DstoreFactory",
							"storeClass": "dstore/RequestMemory",
							"template": TEMPLATE_SCHEMA,
							"name": TEMPLATE_STORE,
							"idProperty": config.idProperty,
							"instanceStore":"page",
							"idType": "string",
							"assignableId": true,
							"dstoreConfig": {
								"target": "gform-app/example/cms/data/template-data.json"
							},
							"createEditorFactory": "gform-app/dynamicstore/createSchemaEditorFactory"
						},
						{
							"factoryId": "gform-app/factory/DstoreFactory",
							"storeClass": "dstore/RequestMemory",
							"templateStore": TEMPLATE_STORE,
							"name": PAGE_STORE,
							"previewerId": "handlebars",
							"typeProperty": "template",
							"parentProperty": "parent",
							"idProperty": config.idProperty,
							"dstoreConfig": {
								"target": "gform-app/example/cms/data/page-data.json"
							},
							"createEditorFactory": "gform-app/createBuilderEditorFactory",
							"efConfig": {
								"idProperty": config.idProperty,
								"idType": config.idType
							}
						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"stores": [
						{id: TEMPLATE_STORE, storeClass: TemplateStore, idProperty: config.idProperty}
					],
					"schemaGenerators": [
						{
							"factoryId": "gform-app/factory/schema/SchemaGenerator",
							"schemaGenerator":schemaGenerator,
							"store": TEMPLATE_STORE // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.

						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/example/dynamic/fallbackSchema.json"
						}
					]
				},
				"resourceFactories": [],
				"view": {
					"layouts": {
						"standard": {
							"store": {"region": "left", "width": "20%"},
							"entity": {"region": "right", "width":"30%"},
							"preview":{"region": "center"}
						},
						"/template": {
							"store": {"region": "left", "width": "50%"},
							"entity": {"region": "center", "width":"100%"}
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
							"controllers": [],
							"children": [

								{
									"factoryId": "gform-app/factory/TreeFactory",
									"title": "tree",
									"osm": true,
									"storeId": "page",
									"labelAttribute": "name"

								},
								{
									"factoryId": "gform-app/factory/GridFactory",
									"title": "template",
									"storeId": TEMPLATE_STORE,
									"gridxQueryTransform": new ToMongoQueryTransform(),
									"columns": [
										{
											"id": "name",
											"field": "name",
											"name": "name"
										}
									]
								}]
						},
						{
							"region": "center",
							"appType": "preview",
							"factoryId": "gform-app/factory/PreviewDispatcherFactory",
							"splitter": true,
							"children": [
								{
									"previewerId": "handlebars",
									"region": "center",
									"factoryId": "gform-app/factory/PreviewerFactory",
									"splitter": true,
									"rendererClass": "gform-app/preview/handlebars/Renderer",
									"pageStore": PAGE_STORE
								}
							]
						},
						{
							"width": "100%",
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

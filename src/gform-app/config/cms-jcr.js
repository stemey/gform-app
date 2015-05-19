define([
		'../meta/CmsSchemaGenerator',
		'../factory/tools/HelpFactory',
		'../factory/SelectViewFactory',
		'../factory/BrandFactory',
		'../mongodb/createEditorFactory',
		'../factory/DynamicResourceFactory',
		'../factory/schema/SchemaGenerator',
		'../factory/schema/StaticSchemaGenerator',
		'../factory/schema/SchemaRegistryFactory',
		'../mongodb/createSchemaEditorFactory',
		'../mongodb/createCollectionEditorFactory',
		'../mongodb/createMdbServerEditorFactory',
		'../util/MongoRest',
		'../util/JcrTemplateRest',
		'../factory/StoreFactory',
		'../util/JsonRest',
		'../controller/gridactions/Delete',
		'../controller/gridactions/OpenAsJson',
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
	], function (CmsSchemaGenerator, HelpFactory, SelectViewFactory, BrandFactory, createEditorFactory, DynamicResourceFactory, SchemaGenerator, StaticSchemaGenerator, SchemaRegistryFactory, createSchemaEditorFactory, createCollectionEditorFactory, createMdbServerEditorFactory, MongoRest, JcrTemplateRest, StoreFactory, JsonRest, Delete, OpenAsJson, TemplateStore, ToMongoQueryTransform) {


		return function (config) {
			var baseUrl = config.baseUrl;
			var schemaGenerator = new SchemaGenerator();
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
							"storeClass": "gform-app/util/JsonRest",
							"name": "/pagetree",
							"target": "http://localhost:8080/tree/",
							"idProperty": "id",
							"mainStore": "/page"
						},
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"name": "/page",
							"previewerId": "handlebars",
							"storeClass": "gform-app/util/JsonRest",
							"templateStore": "/template",
							"idProperty": "identifier",
							"idType": "string",
							"typeProperty": "template",
							"target": "http://localhost:8080/entity/base/",
							"createEditorFactory": "gform-app/createBuilderEditorFactory"
						},
						{
							"factoryId": "gform-app/factory/StoreFactory",
							"name": "/template",
							"storeClass": "gform-app/util/JcrTemplateRest",
							"idProperty": "code",
							"idType": "string",
							"target": "http://localhost:8080/schema/",
							"template": "/template",
							"instanceStore": "/page",
							"createEditorFactory": "gform-app/createBuilderEditorFactory",
							"plainValueFactory": "gform-app/default/createTemplateValueFactory"

						}
					]
				},
				"schemaRegistry": {
					"factoryId": "gform-app/factory/schema/SchemaRegistryFactory",
					"registryClass": "gform-app/SchemaRegistry",
					"stores": [
						{id: "/template", storeClass: TemplateStore}
					],
					"schemaGenerators": [
						{
							"factoryId": "gform-app/factory/meta/CmsSchemaGenerator",
							"schemaGenerator":schemaGenerator,
							"store": "/template" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/schema/fallbackSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "gform-app/factory/schema/StaticSchemaGenerator",
							"module": "gform-app/jcr/folderSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						}
					]
				},
				"resourceFactories": [],
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
									"label": "gform-jcr"
								},
								{
									"factoryId": "gform-app/factory/SelectViewFactory",
									"label": "view"
								},
								{
									"factoryId": "gform-app/factory/FindPageFactory",
									"storeId": "/page",
									"label": "open",
									"searchProperty": "url",
									"labelProperty": "url",
									"placeHolder": "find page ..",
									"includedStoreIds": ["/page"]
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
									"factoryId": "gform-app/factory/HandlebarsCreateFactory",
									"url": "/template",
									"storeId": "/template",
									"label": "add template",
									"includedStoreIds": ["/template"]
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
							"controllers": [],
							"children": [
								{
									"factoryId": "gform-app/factory/TreeFactory",
									"title": "tree",
									"storeId": "/pagetree",
									"labelAttribute": "name"

								},
								{
									"factoryId": "gform-app/factory/GridFactory",
									"title": "template",
									"storeId": "/template",
									"gridxQueryTransform": new ToMongoQueryTransform(),
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
									"pageStore": "/page"
								},
								{
									"previewerId": "gform",
									"region": "center",
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

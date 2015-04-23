define([
		'../factory/tools/HelpFactory',
		'../factory/SelectViewFactory',
		'../factory/BrandFactory',
		'../mongodb/createEditorFactory',
		'../factory/DynamicResourceFactory',
		'../factory/schema/SchemaGenerator',
		'../mongodb/MdbSchemaGenerator',
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
		'../mongodb/MdbSchemaStore',
		'../jcr/TemplateStore',
		'../util/ToMongoQueryTransform',
		'../factory/SingleStoreGridFactory',
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
	], function (HelpFactory, SelectViewFactory, BrandFactory, createEditorFactory, DynamicResourceFactory, SchemaGenerator, MdbSchemaGenerator, StaticSchemaGenerator, SchemaRegistryFactory, createSchemaEditorFactory, createCollectionEditorFactory, createMdbServerEditorFactory, MongoRest, JcrTemplateRest, StoreFactory, JsonRest, Delete, OpenAsJson, MdbSchemaStore, TemplateStore, ToMongoQueryTransform) {


		return function (config) {
			var baseUrl = config.baseUrl;
			return {
				"storeRegistry": {
					"stores": [
						{
							"factoryId": "cms/factory/StoreFactory",
							"storeClass": "cms/util/JsonRest",
							"name": "documentation",
							"previewerId": "documentation",
							"target": "cms/documentation"
						}, {
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
							"previewerId": "handlebars",
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

						}
					]
				},
				"schemaRegistry": {
					"factoryId": "cms/factory/schema/SchemaRegistryFactory",
					"registryClass": "cms/SchemaRegistry",
					"stores": [
						{id: "/template", storeClass: TemplateStore}
					],
					"schemaGenerators": [
						{
							"factoryId": "cms/factory/schema/SchemaGenerator",
							"store": "/template" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "cms/factory/schema/StaticSchemaGenerator",
							"module": "cms/schema/fallbackSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
						},
						{
							"factoryId": "cms/factory/schema/StaticSchemaGenerator",
							"module": "cms/jcr/folderSchema.json" // instances of the generated schema will be place into this store. id Proeprty and idType are taken from this store and added to the schema.
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
							"factoryId": "cms/factory/ToolbarFactory",
							"children": [
								{
									"factoryId": "cms/factory/BrandFactory",
									"label": "gform-jcr"
								},
								{
									"factoryId": "cms/factory/SelectViewFactory",
									"label": "view"
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
									"placeHolder": "add entity.."
								},
								{
									"factoryId": "cms/factory/SingleSchemaCreateFactory",
									"label": "add",
									"iconClass": "fa fa-plus",
									"excludedStoreIds": ["/template", "/mdbserver"]
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
								},
								{
									"factoryId": "cms/factory/StoreLinkFactory",
									"label": "settings",
									"iconClass": "fa fa-cogs"
								},
								{
									"factoryId": "cms/factory/tools/HelpFactory",
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
							"factoryId": "cms/factory/StoreViewFactory",
							"controllers": [],
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
							"factoryId": "cms/factory/PreviewDispatcherFactory",
							"splitter": true,
							"children": [
								{
									"previewerId": "handlebars",
									"region": "center",
									"factoryId": "cms/factory/PreviewerFactory",
									"splitter": true,
									"rendererClass": "cms/preview/handlebars/Renderer",
									"pageStore": "/page"
								},
								{
									"previewerId": "gform",
									"region": "center",
									"factoryId": "cms/factory/SchemaPreviewerFactory",
									"splitter": true
								},
								{
									"previewerId": "documentation",
									"region": "center",
									"factoryId": "cms/factory/DocumentationPreviewerFactory",
									"splitter": true
								}
							]
						},
						{
							"width": "45%",
							"region": "right",
							"appType": "entity",
							"factoryId": "cms/factory/TabOpenerFactory",
							"splitter": true
						}
					]
				}

			}
		}
	}
);

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/json",
  "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./app.html",
	"dojo/text!../schema/template.json",
	"../util/Memory",
	"../createEditorFactory",	
	"gform/opener/SingleEditorTabOpener",
	"gform/Context",
	"gform/schema/convertSchema",
	"gform/util/refresolve",
	"gform/schema/schemaGenerator",
	"../SchemaRegistry",
	"dojo/text!../schema/main.json",	
	"dojo/text!../schema/teaser.json",	
	"dojo/text!../schema/templateStub.json",	
	"gform/controller/actions/Save",
	"gform/controller/actions/Delete",
	"./Preview",	
	"../preview/mustache/Renderer",
	"../preview/UrlBasedStore",

	"./Previewer",
	"dijit/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"gform/controller/ConfirmDialog",
	"./GridController",
	"dijit/Toolbar",
	"dijit/form/Button",
	"gform/controller/ConfirmDialog",
], function(declare, lang, aspect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, templateSchema, Store, createEditorFactory, SingleEditorTabOpener, Context, convertSchema, refresolve, schemaGenerator, SchemaRegistry, mainTemplate, teaserTemplate, templateStub, Save, Delete, Preview, Renderer, UrlBasedStore){


	
return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		baseClass : "gformGridController",
		templateString : template,
		tabContainer:null,
		gridController: null,
		confirmDialog:null,
		postCreate : function() {	
			var opener = new SingleEditorTabOpener();
			opener.tabContainer= this.tabContainer;
			opener.editorFactory = createEditorFactory();
			opener.confirmDialog= this.confirmDialog;
			opener.controllerConfig= {
				plainValueFactory: this.createPlainValue,
				actionClasses: [Save, Delete, Preview]	
			}
			this.ctx = new Context();
			this.ctx.opener = opener;
			opener.ctx= this.ctx;
			var schemaRegistry = new SchemaRegistry();
			var templateStore= new Store();
			schemaRegistry.registerStore("/template", templateStore);
			schemaRegistry.register("/template",this.createTemplateSchema() );
			templateStore.add(json.parse(mainTemplate));
			templateStore.add(json.parse(teaserTemplate));

			this.ctx.storeRegistry.register("/template", templateStore);
			var pageStore = new Store();
			this.ctx.storeRegistry.register("/page", pageStore);
			this.ctx.schemaRegistry = schemaRegistry;
			this.gridController.set("ctx", this.ctx);	

			this.previewer.renderer= new Renderer();
			this.previewer.renderer.templateStore= new UrlBasedStore(templateStore);
			this.previewer.renderer.pageStore= new UrlBasedStore(pageStore);



			// we need an extra opener that for tempate where the opener's plainValueFactory is null.
		},
		createPlainValue: function(schema) {
			// we only know the id not the store, so we do this for both pages and templates
			if (schema.id=="/cms/template") {
				return json.parse(templateStub);
			}
			return {template: "/template/"+schema.id}
		},
		preview: function() {
			var selectedPageId= this.gridController.getSelectedPage();
			this.previewer.display("/page/"+selectedPageId);
		},
		createNewTemplate: function() {
			var me = this;
	
			this.ctx.opener.createSingle({url:"/template", schemaUrl:"/template"});//, callback:callback});
		},
		createNewPage: function() {
			var selectedTemplate = this.gridController.getSelectedTemplate();
			if (!selectedTemplate) {
				alert("select a template");
			} else {
				var me = this;
				var callback= function(id) {
					var page = me.ctx.storeRegistry.get("/page").get(id);
					page.template="/template/"+selectedTemplate;
					//me.ctx.storeRegistry.get("/page").put(page);
				}
				this.ctx.opener.createSingle({url:"/page", schemaUrl:"/template/"+selectedTemplate, callback:callback});
			}
		},
		showTemplate: function() {
			var selectedTemplate = this.gridController.getSelectedTemplate();
			this.ctx.opener.openSingle({url: "/template/"+selectedTemplate, schemaUrl: "/template"});
		},
		createTemplateSchema: function() {
			var schema = schemaGenerator.generate(createEditorFactory());
			refresolve(schema);
		  var meta = convertSchema(schema);
			meta.store="/schema";
			// get attributes of root.listpane
			var attributes = meta.attributes[0].validTypes[0].attributes;
			var baseSchema = json.parse(templateSchema)
			for (var key in attributes) {
				if (attributes[key].code=="attributes") {
					baseSchema.attributes.push(attributes[key]);
				}
			}
			
			return baseSchema;
		}
	});


});

define([
    'dojo/when',
    '../meta/Resolver',
    'gform/schema/transform',
    'dojo/parser',
    'dojo/topic',
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
    "gform/createFullEditorFactory",
    "gform/opener/SingleEditorTabOpener",
    "gform/Context",
    "../meta/SchemaGenerator",
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
    "gform/controller/ConfirmDialog"
], function (when, Resolver, transform, parser, topic, declare, lang, aspect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, templateSchema, Store, createEditorFactory, SingleEditorTabOpener, Context, SchemaGenerator, SchemaRegistry, mainTemplate, teaserTemplate, templateStub, Save, Delete, Preview, Renderer, UrlBasedStore) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "gformGridController",
        templateString: template,
        tabContainer: null,
        gridController: null,
        confirmDialog: null,
        postCreate: function () {
            var opener = new SingleEditorTabOpener();
            opener.tabContainer = this.tabContainer;
            opener.editorFactory = createEditorFactory();
            var templateConverter = {
                parse: function(value) {
                    return "/template/"+value;
                },
                format: function(value) {
                    return parseFloat(value.substring(10));
                }
            }
            opener.editorFactory.addConverterForid(templateConverter,"templateConverter");
            opener.confirmDialog = this.confirmDialog;
            opener.controllerConfig = {
                plainValueFactory: this.createPlainValue,
                actionClasses: [Save, Delete, Preview]
            }
            this.ctx = new Context();
            this.ctx.opener = opener;
            opener.ctx = this.ctx;
            this.schemaRegistry = new SchemaRegistry();
            var templateStore = new Store();
            this.schemaRegistry.registerStore("/template", templateStore);
            this.loadTemplateSchema();
            templateStore.add(json.parse(mainTemplate));
            templateStore.add(json.parse(teaserTemplate));

            this.ctx.storeRegistry.register("/template", templateStore);
            var pageStore = new Store();
            this.ctx.storeRegistry.register("/page", pageStore);
            aspect.after(pageStore, "put", lang.hitch(this, "onPageUpdated"));
            this.ctx.schemaRegistry = this.schemaRegistry;
            this.gridController.set("ctx", this.ctx);

            this.previewer.renderer = new Renderer();
            this.previewer.renderer.templateStore = new UrlBasedStore(templateStore);
            this.previewer.renderer.pageStore = new UrlBasedStore(pageStore);

            aspect.after(this.gridController,"pageSelected",lang.hitch(this,"pageSelected"));

            topic.subscribe(this.tabContainer.id+"-selectChild", lang.hitch(this, "tabSelected"));


            // we need an extra opener for templates where the opener's plainValueFactory is null.
        },
        tabSelected: function(page) {
            if (page.editor.meta.attributes && page.editor.meta && page.editor.meta.id!="/cms/template") {
                var id = page.editor.getPlainValue()["id"];
                if (id) {
                    this.previewer.display("/page/" + id);
                }
            }
        },
        onPageUpdated: function(id, entity) {
            if (id) {
                this.previewer.display("/page/" + id);
            }
            return id;
        },
        pageSelected: function(e) {
            this.preview();
        },
        createPlainValue: function (schema) {
            // we only know the id not the store, so we do this for both pages and templates
            if (schema.id == "/cms/template") {
                return json.parse(templateStub);
            }
            return {template: "/template/" + schema.id}
        },
        preview: function () {
            var selectedPageId = this.gridController.getSelectedPage();
            this.previewer.display("/page/" + selectedPageId);
        },
        createNewTemplate: function () {
            var me = this;

            this.ctx.opener.createSingle({url: "/template", schemaUrl: "/template"});//, callback:callback});
        },
        createNewPage: function () {
            var selectedTemplate = this.gridController.getSelectedTemplate();
            if (!selectedTemplate) {
                alert("select a template");
            } else {
                var me = this;
                var callback = function (id) {
                    var page = me.ctx.storeRegistry.get("/page").get(id);
                    page.template = "/template/" + selectedTemplate;
                    //me.ctx.storeRegistry.get("/page").put(page);
                }
                this.ctx.opener.createSingle({url: "/page", schemaUrl: "/template/" + selectedTemplate, callback: callback});
            }
        },
        showTemplate: function () {
            var selectedTemplate = this.gridController.getSelectedTemplate();
            this.ctx.opener.openSingle({url: "/template/" + selectedTemplate, schemaUrl: "/template"});
        },
        loadTemplateSchema: function () {
            var generator = new SchemaGenerator();
            var promise = generator.loadTemplateSchema();
            when(promise).then(lang.hitch(this, "onSchemaLoaded"));
        },
        onSchemaLoaded: function (meta) {
            meta.store = "/schema";
            // get attributes of root.listpane
            var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = json.parse(templateSchema)


            baseSchema.groups[2].attributes.push(attributes);


            //baseSchema.groups[2].attributes=meta.attributes;

            this.schemaRegistry.register("/template", baseSchema);
        }
    });


});

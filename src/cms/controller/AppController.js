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
    "../Configuration",
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
], function (when, Resolver, transform, parser, topic, declare, lang, aspect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Configuration, templateSchema, Store, createEditorFactory, SingleEditorTabOpener, Context, SchemaGenerator, SchemaRegistry, mainTemplate, teaserTemplate, templateStub, Save, Delete, Preview, Renderer, UrlBasedStore) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "gformGridController",
        templateString: template,
        tabContainer: null,
        gridController: null,
        confirmDialog: null,
        postCreate: function () {


            this.ctx = new Context();
            var opener = this._createOpener();
            this.ctx.opener = opener;

            this.configuration = new Configuration();
            this.configuration.load().then(lang.hitch(this, "_onConfigured")).otherwise(function (e) {
                alert("error");
                console.log(e.message, e.stack)
            });

            // we need an extra opener for templates where the opener's plainValueFactory is null.
        },
        _createOpener: function () {
            var opener = new SingleEditorTabOpener();
            opener.tabContainer = this.tabContainer;
            opener.editorFactory = createEditorFactory();
            var templateConverter = {
                parse: function (value) {
                    return "/template/" + value;
                },
                format: function (value) {
                    return parseFloat(value.substring(10));
                }
            }
            opener.editorFactory.addConverterForid(templateConverter, "templateConverter");
            opener.confirmDialog = this.confirmDialog;
            opener.controllerConfig = {
                plainValueFactory: lang.hitch(this, "createPlainValue"),
                actionClasses: [Save, Delete, Preview]
            }

            opener.ctx = this.ctx;
            return opener;
        },
        _onConfigured: function () {

            this.schemaRegistry = new SchemaRegistry();
            var templateStore = this.configuration.templateStore;
            this.schemaRegistry.registerStore("/template", templateStore);
            this.loadTemplateSchema();
            templateStore.add(json.parse(mainTemplate));
            templateStore.add(json.parse(teaserTemplate));

            this.ctx.storeRegistry.register("/template", templateStore);
            var pageStore = this.configuration.pageStore;
            this.ctx.storeRegistry.register("/page", pageStore);
            aspect.around(pageStore, "put", lang.hitch(this, "onPageUpdated"));
            this.ctx.schemaRegistry = this.schemaRegistry;

            this.gridController.configure(this.ctx);


            this.previewer.renderer = new Renderer();
            this.previewer.renderer.templateStore = templateStore;
            this.previewer.renderer.pageStore = pageStore;

            aspect.after(this.gridController, "pageSelected", lang.hitch(this, "pageSelected"));

            topic.subscribe(this.tabContainer.id + "-selectChild", lang.hitch(this, "tabSelected"));
        },
        tabSelected: function (page) {
            if (page.editor.meta.attributes && page.editor.meta && page.editor.meta.id != "/cms/template") {
                var id = page.editor.getPlainValue()["id"];
                if (id) {
                    this.previewer.display("/page/" + id);
                }
            }
        },
        onPageUpdated: function (superCall) {
            var me =this;
            return function(entity) {
                var result = superCall.apply(this, arguments);
                if (entity) {
                    me.previewer.display("/page/" + entity[me.configuration.pageStore.idProperty]);
                }
                return result;
            }
        },
        pageSelected: function (e) {
            this.preview();
        },
        createPlainValue: function (schema) {
            // we only know the id not the store, so we do this for both pages and templates
            if (schema.id == "/cms/template") {
                var template = json.parse(templateStub);
                var conf = this.configuration.templateStore;
                template.attributes.push({code: conf.idProperty, "type": conf.idType,"editor": conf.idType, "visible": false});
                return template;
            } else {
                return {template: "/template/" + schema[this.configuration.templateStore.idProperty]}
            }
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
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded"));
        },
        onTemplateSchemaLoaded: function (meta) {
            meta.store = "/schema";
            // get attributes of root.listpane
            var attributes = meta.attributes[0].groups[0].attributes[2];
            var baseSchema = json.parse(templateSchema)
            var idAttribute={};
            idAttribute["type"]=this.configuration.templateStore.idType;
            idAttribute["code"]=this.configuration.templateStore.idProperty;
            baseSchema.groups[0].attributes.push(idAttribute);


            baseSchema.groups[2].attributes.push(attributes);


            //baseSchema.groups[2].attributes=meta.attributes;

            this.schemaRegistry.register("/template", baseSchema);
        }
    });


});

define([
    '../util/AtemStoreRegistry',
    'dojo/dom-geometry',
    'dijit/form/ToggleButton',
    '../meta/TemplateSchemaTransformer',
    'dojo/when',
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
    "../createBuilderEditorFactory",
    "./TabOpener",
    "gform/Context",
    "../meta/SchemaGenerator",
    "../SchemaRegistry",
    "dojo/text!../schema/templateStub.json",
    "gform/controller/actions/Save",
    "gform/controller/actions/Delete",
    "./actions/Preview",
    "../preview/mustache/Renderer",
    "./Previewer",
    "dijit/layout/BorderContainer",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "gform/controller/ConfirmDialog",
    "./GridController",
    "dijit/Toolbar",
    "dijit/form/Button",
    "gform/controller/ConfirmDialog"
], function (AtemStoreRegistry, domGeometry, ToggleButton, TemplateSchemaTransformer, when, topic, declare, lang, aspect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Configuration, templateSchema, Store, createEditorFactory, SingleEditorTabOpener, Context, SchemaGenerator, SchemaRegistry, templateStub, Save, Delete, Preview, Renderer) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "gformAppController",// TODO use proper base class
        templateString: template,
        tabContainer: null,
        gridController: null,
        confirmDialog: null,
        fullSize: false,

        postCreate: function () {
            this.configuration = new Configuration();
            this.configuration.load().then(lang.hitch(this, "_onConfigured")).otherwise(function (e) {
                alert("error");
                console.log(e.message, e.stack)
            });
        },
        _createOpener: function () {
            var opener = new SingleEditorTabOpener();
            opener.tabContainer = this.tabContainer;
            // TODO editorFactory needs to be configurable
            opener.editorFactory = createEditorFactory();
            opener.confirmDialog = this.confirmDialog;
            opener.controllerConfig = {
                plainValueFactory: lang.hitch(this, "createPlainValue"), // make plainValueFactory configurable
                actionClasses: [Save, Delete, Preview] // TODO actionClasses don't work. use actionFactory
            }

            opener.configuration=this.configuration;
            opener.ctx = this.ctx;
            opener.init();
            return opener;
        },
        _onConfigured: function () {
            var templateStore = this.configuration.templateStore;

            var templateConverter = this.configuration.templateConverter;
            this.ctx = new Context();
            var opener = this._createOpener();
            this.ctx.opener = opener;
            this.ctx.opener.editorFactory.addConverterForid(templateConverter, "templateConverter");

            this.schemaRegistry = new SchemaRegistry();

            var templateToSchemaTransformer = new TemplateSchemaTransformer(this.configuration.templateStore);
            this.schemaRegistry.pageTransformer = templateToSchemaTransformer
            this.schemaRegistry.templateTransformer = new TemplateSchemaTransformer(templateStore);

            this.schemaRegistry.registerStore("/template", templateStore);
            this.loadTemplateSchema();

            this.ctx.storeRegistry = new AtemStoreRegistry();
            this.ctx.storeRegistry.register("/template", templateStore);
            var pageStore = this.configuration.pageStore;
            this.ctx.storeRegistry.register("/page", pageStore);
            aspect.around(templateStore, "put", lang.hitch(this, "onTemplateUpdated"));
            // TODO should be published by controller along with oldUrl/oldparentId to implement moving in tree.
            aspect.around(pageStore, "put", lang.hitch(this, "onPageUpdated"));
            aspect.around(pageStore, "remove", lang.hitch(this, "onPageDeleted"));
            this.ctx.schemaRegistry = this.schemaRegistry;

            this.gridController.configure(this.ctx, this.configuration);


            this.previewer.pageStore=pageStore;
            this.previewer.renderer = new Renderer();
            this.previewer.renderer.templateStore = templateStore;
            this.previewer.renderer.pageStore = pageStore;
            this.previewer.renderer.templateToSchemaTransformer = templateToSchemaTransformer;

            window.appController = this;


        },

        onPageUpdated: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                result.then(function() {
                  //me.refreshPreview();
                  topic.publish("/page/updated",{entity:entity})
                });
                return result;
            }
        },
        onPageDeleted: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                //me.refreshPreview();
                topic.publish("/page/deleted",{entity:entity})
                return result;
            }
        },
        onTemplateUpdated: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                //me.refreshPreview();
                return result;
            }
        },
        createPlainValue: function (schema) {
            // TODO move to configuration
            if (schema.id == "/cms/template") {
                var attributes=[];
                attributes.push({code:"url","editor":"string",type:"string", required:true});
                attributes.push({code:"identifier","editor":"string",type:"string", required:false});
                attributes.push({code:"template","editor":"string",type:"string", required:false});

                var group={editor:"listpane",attributes:attributes};

                var template = json.parse(templateStub);
                var conf = this.configuration.templateStore;
                template.attributes.push({code: conf.idProperty, "type": conf.idType, "editor": conf.idType, "visible": false});
                template.group=group;
                return template;
            } else {
                return {template:  schema[this.configuration.templateStore.idProperty]}
            }
        },
        refreshPreview: function () {
            this.previewer.refresh();
        },
        followPreviewLink: function (url) {
            // TODO move to previewer
            this.previewer.displayByUrl(url);
        },
        createNewTemplate: function () {
            var me = this;
            this.ctx.opener.createSingle({url: "/template", schemaUrl: "/template"});//, callback:callback});
        },
        createNewPage: function () {
            // TODO template should be selectable in select next to create button
            var selectedTemplate = this.gridController.getSelectedTemplate();
            if (!selectedTemplate) {
                alert("select a template");
            } else {
                this.ctx.opener.createSingle({url: "http://localhost:8080/entity/base/", schemaUrl: "/template/" + selectedTemplate, callback: callback});
            }
        },
        showTemplate: function () {
            var selectedTemplate = this.gridController.getSelectedTemplate();
            this.ctx.opener.openSingle({url: "/template",id: selectedTemplate, schemaUrl: "/template"});
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
            var idAttribute = {};
            idAttribute["type"] = this.configuration.templateStore.idType;
            idAttribute["code"] = this.configuration.templateStore.idProperty;
            baseSchema.groups[0].attributes.push(idAttribute);

            var group = meta.attributes[0];
            group.requiredAttributes = true;
            baseSchema.groups[3].attributes.push(group);


            this.schemaRegistry.register("/template", baseSchema);
        },
        closeTabs: function () {
            var closeables = [];
            this.tabContainer.getChildren().forEach(function (tab) {
                if (!tab.editor.hasChanged()) {
                    closeables.push(tab);
                }
            });
            closeables.forEach(function (tab) {
                this.tabContainer.closeChild(tab);
            }, this);
        },
        toggleFullSize: function () {
            this.fullSize = !this.fullSize;

            if (this.fullSize) {
                this.originalSizes = {};
                var size = domGeometry.getContentBox(this.gridController.domNode);
                this.originalSizes[this.gridController.id] = size.w;
                size = domGeometry.getContentBox(this.tabContainer.domNode);
                this.originalSizes[this.tabContainer.id] = size.w;
                this.borderContainer._layoutChildren(this.gridController.id, 0);
                this.borderContainer._layoutChildren(this.tabContainer.id, 0);
            } else {
                Object.keys(this.originalSizes).forEach(function (key) {
                    this.borderContainer._layoutChildren(key, this.originalSizes[key]);
                }, this)
            }
        }
    });


});

define([
    '../factory/FactoryContext',
    '../factory/schema/SchemaRegistryFactory',
    '../factory/StoreRegistryFactory',
    'dojox/mvc/_atBindingExtension',
    '../factory/BorderContainerFactory',
    '../factory/PreviewerFactory',
    '../factory/TabOpenerFactory',
    'dijit/layout/TabContainer',
    '../factory/TabFactory',
    '../util/JsonRest',
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
    "../config/main",
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
    "dijit/Toolbar",
    "dijit/form/Button",
    "gform/controller/ConfirmDialog"
], function (FactoryContext, SchemaRegistryFactory, StoreRegistryFactory, atBindingExtension, BorderContainerFactory, PreviewerFactory, TabOpenerFactory, TabContainer, TabFactory, JsonRest, AtemStoreRegistry, domGeometry, ToggleButton, TemplateSchemaTransformer, when, topic, declare, lang, aspect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Configuration, main, templateSchema, Store, createEditorFactory, SingleEditorTabOpener, Context, SchemaGenerator, SchemaRegistry, templateStub, Save, Delete, Preview, Renderer) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "gformAppController",// TODO use proper base class
        templateString: template,
        tabContainer: null,
        //gridController: null,
        confirmDialog: null,
        base: null,
        fullSize: false,

        postCreate: function () {
            this.inherited(arguments);
            this.configuration = new Configuration();


            new StoreRegistryFactory().create(main.storeRegistry).then(lang.hitch(this, "_onConfigured"));


        },
        _onConfigured: function (storeRegistry) {

            var ctx = new FactoryContext({storeRegistry:storeRegistry});
            ctx.context = new Context();
            ctx.context.storeRegistry=storeRegistry;
            var pageStore = storeRegistry.get("/page");
            var templateStore = storeRegistry.get("/template");
            aspect.around(templateStore, "put", lang.hitch(this, "onTemplateUpdated"));
            // TODO should be published by controller along with oldUrl/oldparentId to implement moving in tree.
            aspect.around(pageStore, "put", lang.hitch(this, "onPageUpdated"));
            aspect.around(pageStore, "remove", lang.hitch(this, "onPageDeleted"));

            var p = new SchemaRegistryFactory().create(ctx,main.schemaRegistry);
            p.then(lang.hitch(this, "_onRegistry",ctx));

        },
        _onRegistry: function (ctx, registry) {
            this.schemaRegistry = registry;
            ctx.context.schemaRegistry=registry;
            this.loadTemplateSchema();

            // TODO this should not be the gform context but a sepearate instance with different features


            var borderContainer = new BorderContainerFactory().create(ctx, main.views);

            borderContainer.placeAt(this.domNode);
            borderContainer.startup();
            window.appController = this;


        },

        onPageUpdated: function (superCall) {
            // TODO use generic topic message
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                result.then(function () {
                    //me.refreshPreview();
                    topic.publish("/page/updated", {entity: entity})
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
                topic.publish("/page/deleted", {entity: entity})
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
        refreshPreview: function () {
            this.previewer.refresh();
        },
        followPreviewLink: function (url) {
            // TODO move to previewer
            topic.publish("/page/navigate", {url: url})
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
            idAttribute["type"] = "string";//this.configuration.templateStore.idType;
            idAttribute["code"] = "code";//this.configuration.templateStore.idProperty;
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

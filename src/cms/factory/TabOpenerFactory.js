define([
    'dijit/registry',
    'gform/Context',
    'dojo/_base/lang',
    '../controller/TabOpener',
    'dijit/layout/TabContainer',
    "dojo/_base/declare",
    "../createBuilderEditorFactory"
], function (registry, Context, lang, TabOpener, TabContainer, declare, createBuilderEditorFactory) {


    return declare([], {
        _createOpener: function (tabContainer, ectx) {
            var ctx = ectx;//new Context();
            //lang.mixin(ctx, ectx);
            var opener = new TabOpener();
            opener.tabContainer = tabContainer;
            // TODO editorFactory needs to be configurable
            opener.editorFactory = createBuilderEditorFactory();

            // TODO reactivate confirmDialog
            //
            opener.confirmDialog = registry.byId("confirmDialog");

            opener.controllerConfig = {
                plainValueFactory: lang.hitch(this, "createPlainValue") // make plainValueFactory configurable
                //actionClasses: [Save, Delete, Preview]
                // TODO actionClasses don't work. use actionFactory
            }

            // TODO move into editorFactory
            require(["cms/util/stringTemplateConverter"], function (templateConverter) {
                opener.editorFactory.addConverterForid(templateConverter, "templateConverter");
            });
            //var templateConverter = this.configuration.templateConverter;
            //this.ctx.opener.editorFactory.addConverterForid(templateConverter, "templateConverter");


            //opener.configuration = this.configuration;
            opener.ctx = ctx;
            ctx.opener = opener;
            opener.init();
            return opener;
        },

        createPlainValue: function (schema) {
            // TODO move to configuration
            if (schema.id == "/cms/template") {
                var attributes = [];
                attributes.push({code: "url", "editor": "string", type: "string", required: true});
                attributes.push({code: "identifier", "editor": "string", type: "string", required: false});
                attributes.push({code: "template", "editor": "string", type: "string", required: false});

                var group = {editor: "listpane", attributes: attributes};

                var template = json.parse(templateStub);
                var conf = this.configuration.templateStore;
                template.attributes.push({code: conf.idProperty, "type": conf.idType, "editor": conf.idType, "visible": false});
                template.group = group;
                return template;
            } else {
                return {template: schema[this.configuration.templateStore.idProperty]}
            }
        },
        create: function (ctx, config) {

            var props = {};
            props.region = config.region;
            props.style = {display:"block", splitter:true};
            props.style.width = config.width;
            var tabContainer = new TabContainer(props);
            //tabContainer.set("style", {height: "100%", width: "40%"});


            var opener = this._createOpener(tabContainer, ctx);
            var store = ctx.getStore(config.storeId);


            return tabContainer;
        }
    });


});

define([
    'dijit/registry',
    '../CmsContext',
    '../controller/TabOpener',
    'dijit/layout/TabContainer',
    "dojo/_base/declare",
    "../createBuilderEditorFactory"
], function (registry, CmsContext, TabOpener, TabContainer, declare, createBuilderEditorFactory) {


    return declare([], {
        _createOpener: function (tabContainer, ectx) {
            var ctx = new CmsContext();
            ctx.storeRegistry = ectx.storeRegistry;
            ctx.schemaRegistry = ectx.schemaRegistry;

            var opener = new TabOpener();
            opener.tabContainer = tabContainer;
            // TODO editorFactory needs to be configurable
            opener.editorFactory = createBuilderEditorFactory();

            opener.confirmDialog = registry.byId("confirmDialog");

            createPlainValue = function (schema) {
                if (this.store.getDefault) {
                    return this.store.getDefault(schema, ctx);
                } else {
                    return {};
                }
            }

            opener.controllerConfig = {
                plainValueFactory: createPlainValue
            }

            // TODO move into editorFactory
            require(["cms/util/stringTemplateConverter"], function (templateConverter) {
                opener.editorFactory.addConverterForid(templateConverter, "templateConverter");
            });

            opener.ctx = ctx;
            ctx.opener = opener;
            opener.init();
            return opener;
        },


        create: function (ctx, config) {

            this.templateStore = ctx.getStore("/template");
            var props = {};
            props.region = config.region;
            props.splitter = true;
            props.style = {};
            props.style.width = config.width;
            var tabContainer = new TabContainer(props);


            var opener = this._createOpener(tabContainer, ctx);


            return tabContainer;
        }
    });


});

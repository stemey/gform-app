define([
    '../util/topic',
    '../dynamicstore/SchemaTransformer',
    'dojo/_base/lang',
    'gform/Editor',
    "dojo/_base/declare"
], function (topic, SchemaTransformer, lang, Editor, declare) {


    return declare("cms.SchemaPreviewer", [Editor], {
        ctx: null,
        appCtx: null,
        idProperty: null,
        baseClass: "gformSchemaPreviewer",
        constructor: function () {
            //topic.subscribe("/focus", lang.hitch(this, "onEntityFocus"));
            //topic.subscribe("/modify/update", lang.hitch(this, "onModifyUpdate"));
            //topic.subscribe("/modify/cancel", lang.hitch(this, "onModifyCancel"));
        },
        onEntityFocus: function (evt) {
            var store = this.appCtx.getCurrentStore();
            this.set("editorFactory", store.editorFactory);
            store.get(evt.id).then(lang.hitch(this, "display", store));
        },
        hide: function () {
            display(null, {group: {attributes: [], editor: "listpane"}});
        },
        onModifyUpdate: function (evt) {
            var store = this.appCtx.getCurrentStore();
            this.set("editorFactory", store.editorFactory);
            this.display(store, evt.value);
        },
        onModifyCancel: function (evt) {
            this.onEntityFocus(evt);
        },
        display: function (store, entity) {
            // TODO get transformer from store?
            var transformer = new SchemaTransformer({ctx: this.ctx, idProperty: this.idProperty});
            var me = this;
            try {
                transformer.transform(entity.group).then(function (schema) {
                    me.setMetaAndDefault(schema);
                });
            } catch (e) {
                console.log("error during rendering schema preview ", e);
            }
        },
        refresh: function () {
        }
    });
});

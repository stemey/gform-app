define(['dijit/MenuItem',
    'dijit/registry',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'gform/opener/SingleEditorTabOpener',
    'dojo/topic'], function (MenuItem, registry, declare, lang, SingleEditorTabOpener, topic) {


    return declare([SingleEditorTabOpener], {
        opening: false,
        init: function() {
            //topic.subscribe("/template/focus", lang.hitch(this, "onTemplateFocus"));
            topic.subscribe("/focus", lang.hitch(this, "onPageFocus"));
            topic.subscribe(this.tabContainer.id + "-selectChild", lang.hitch(this, "tabSelected"));
            topic.subscribe("/new", lang.hitch(this, "onNew"));


            var menu = registry.byId(this.tabContainer.id + "_tablist_Menu");

            var me = this;
            menu.addChild(
                new MenuItem({
                    label: "Alle Schließen",
                    ownerDocument: this.tabContainer.ownerDocument,
                    dir: this.tabContainer.dir,
                    lang: this.tabContainer.lang,
                    textDir: this.tabContainer.textDir,
                    onClick: function (evt) {
                        me.closeTabs();
                    }
                })
            );
        },
        openSingle: function (param) {
            if (!this.opening) {
                topic.publish("/focus", {store: param.url, id: param.id});
            }
            this.inherited(arguments);
        },
        onPageFocus: function (evt) {
            var me = this;
            if (evt.source != this) {
                this.ctx.getSchemaUrl(evt.store, evt.id).then(function (schemaUrl) {
                    me.opening=true;
                    try {
                        // TODO rather use openMulti, so entity is not loaded twice
                        me.openSingle({url: evt.store, id: evt.id, schemaUrl: schemaUrl});
                    } finally {
                        me.opening=false;
                    }
                });
            }
        },
//        onTemplateFocus: function (evt) {
//            if (evt.source != this) {
//                this.openSingle({url: "/template", id: evt.id, schemaUrl: "/template"});
//            }
//        },
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
        onNew: function (evt) {
            this.createSingle({url: evt.store, schemaUrl: evt.schemaUrl});
        },
        tabSelected: function (page) {
            //if (page.editor.meta && page.editor.meta.id != "/cms/template") {
                // TODO getting store from crudController is lame
                var store = page.store;
                var id = store.getIdentity(page.editor.getPlainValue());
                // TODO template property needs to be configurable
                //var template = page.editor.getPlainValue()[store.typePropery];
                if (id) {
                    // already loaded!!
                    topic.publish("/focus", {id: id, store: store.name, source: this})
                }
            //}
        }
    });

});
define(['dijit/MenuItem',
    'dijit/registry',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'gform/opener/SingleEditorTabOpener',
    'dojo/topic'], function (MenuItem, registry, declare, lang, SingleEditorTabOpener, topic) {


    return declare([SingleEditorTabOpener], {
        init: function () {
            topic.subscribe("/template/focus", lang.hitch(this, "onTemplateFocus"));
            topic.subscribe("/page/focus", lang.hitch(this, "onPageFocus"));
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
        onPageFocus: function (evt) {
            if (evt.source != this) {
                this.openSingle({url: "/page", id: evt.id, schemaUrl: "/template/" + evt.template});
            }
        },
        onTemplateFocus: function (evt) {
            if (evt.source != this) {
                this.openSingle({url: "/template", id: evt.id, schemaUrl: "/template"});
            }
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
        onNew: function (evt) {
            this.createSingle({url: evt.url, schemaUrl: evt.schemaUrl});
        },
        tabSelected: function (page) {
            if (page.editor.meta && page.editor.meta.id != "/cms/template") {
                var id = page.editor.getPlainValue()[this.ctx.getStore("/page").idProperty];
                var template = page.editor.getPlainValue()["template"];
                if (id) {
                    // already loaded!!
                    topic.publish("/page/focus", {id: id, source: this, template: template})
                }
            }
        }
    });

});
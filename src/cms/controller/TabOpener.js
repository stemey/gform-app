define(['dojo/_base/declare',
    'dojo/_base/lang',
    'gform/opener/SingleEditorTabOpener',
    'dojo/topic'], function (declare, lang, SingleEditorTabOpener, topic) {


    return declare([SingleEditorTabOpener], {
        init: function () {
            topic.subscribe("/template/focus", lang.hitch(this, "onTemplateFocus"));
            topic.subscribe("/page/focus", lang.hitch(this, "onPageFocus"));
            topic.subscribe(this.tabContainer.id + "-selectChild", lang.hitch(this, "tabSelected"));
            topic.subscribe("/new", lang.hitch(this, "onNew"));
        },
        onPageFocus: function (evt) {
            if (evt.source!=this) {
                this.openSingle({url: "/page", id: evt.id, schemaUrl: "/template/" + evt.template});
            }
        },
        onTemplateFocus: function (evt) {
            if (evt.source!=this) {
                this.openSingle({url: "/template",id:evt.id, schemaUrl: "/template"});
            }
        },
        onNew: function(evt) {
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
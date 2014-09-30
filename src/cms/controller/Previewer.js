define([
    'dojo/_base/lang',
    '../util/topic',
    "dojo/_base/declare",
    "dojo/when",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Previewer.html"
], function (lang, topic, declare, when, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Previewer", [ _WidgetBase, _TemplatedMixin], {
        templateString: template,
        pageStore: null,
        iframe: null,
        renderer: null,
        postCreate: function () {
            this.inherited(arguments);

            topic.subscribe("/page/navigate", lang.hitch(this, "onPageNavigate"));
            topic.subscribeStore("/focus", lang.hitch(this, "onPageFocus"), this.pageStore.name);
            topic.subscribeStore("/updated", lang.hitch(this, "onPageUpdated"), this.pageStore.name);
            topic.subscribeStore("/deleted", lang.hitch(this, "onPageDeleted"), this.pageStore.name);
        },
        onPageFocus: function (evt) {
            this.display(evt.store + "/" + evt.id);
        },
        onPageUpdated: function (evt) {
            this.display(evt.store + "/" + evt.entity[this.pageStore.idProperty]);
        },
        onPageDeleted: function (evt) {
            // this.display("/page/"+evt.id);
        },
        onPageNavigate: function (evt) {
            //TODO move to general component or AppController
            var me = this;
            var page = this.pageStore.query({url: evt.url});
            when(page).then(function (pageResults) {
                var id = me.pageStore.getIdentity(pageResults[0]);
                var template = pageResults[0].template;
                if (template) {
                    topic.publish("/focus", {id: id, store: me.pageStore.name, template: template, source: this});
                }
            });
        },
        display: function (url) {
            // TODO improve error reporting
            var me = this;
            this.url = url;
            when(me.renderer.render(url))
                .then(function (result) {
                    if (!result.noPage) {

                        var html = result.html;
                        if (result.errors && result.errors.length > 0) {
                            html = "<ul>";
                            result.errors.forEach(function (error) {
                                html += "<li>" + error.message + "</li>";
                            });
                            html += "</ul>";
                        }
                        var ifrm = (me.iframe.contentWindow) ? me.iframe.contentWindow : (me.iframe.contentDocument.document) ? me.iframe.contentDocument.document : me.iframe.contentDocument;
                        // remove preexisting amd define
                        delete ifrm.define;
                        ifrm.document.open();
                        ifrm.document.write(html);
                        ifrm.document.close();
                    }
                }).otherwise(function (e) {
                    alert("cannot render " + e.stack)
                });
        },
        displayById: function (id) {
            this.display("/page/" + id);
        },
        refresh: function () {
            if (this.url) {
                this.display(this.url);
            }
        }
    });
});

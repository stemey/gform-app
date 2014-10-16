define([
    'dojo/aspect',
    'dojo/_base/lang',
    '../util/topic',
    "dojo/_base/declare",
    "dojo/when",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Previewer.html"
], function (aspect, lang, topic, declare, when, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Previewer", [ _WidgetBase, _TemplatedMixin], {
        templateString: template,
        pageStore: null,
        iframe: null,
        postCreate: function () {
            this.inherited(arguments);

            topic.subscribe("/page/navigate", lang.hitch(this, "onPageNavigate"));
            topic.subscribeStore("/focus", lang.hitch(this, "onPageFocus"), this.pageStore.store.name);
            topic.subscribeStore("/updated", lang.hitch(this, "onPageUpdated"), this.pageStore.store.name);
            topic.subscribeStore("/deleted", lang.hitch(this, "onPageDeleted"), this.pageStore.store.name);

            // TODO this results in two callbacks??? that is why we need to check if rendering===true
            aspect.after(this.pageStore,"onUpdate",lang.hitch(this,"refresh"));
            //topic.subscribeStore("/modify/update", lang.hitch(this, "onPageRefresh"), this.pageStore.name);
        },
        onPageFocus: function (evt) {
            this.display(evt.store + "/" + evt.id);
        },
        onPageUpdated: function (evt) {
            this.display(evt.store + "/" + evt.entity[this.pageStore.store.idProperty]);
        },
        onPageDeleted: function (evt) {
            // this.display("/page/"+evt.id);
        },
        onPageRefresh: function(evt) {
              this.refresh();
        },
        onPageNavigate: function (evt) {
            //TODO move to general component or AppController
            var me = this;
            var page = this.pageStore.store.query({url: evt.url});
            when(page).then(function (pageResults) {
                var id = me.pageStore.store.getIdentity(pageResults[0]);
                var template = pageResults[0].template;
                if (template) {
                    topic.publish("/focus", {id: id, store: me.pageStore.store.name, template: template, source: this});
                }
            });
        },
        rendering:false,
        display: function (url) {
            // TODO improve error reporting
            var me = this;
            var scollToTop=this.url!==url;
            this.url = url;
            var renderer = this.createRenderer();
            when(renderer.render(url))
                .then(function (result) {
                    me.rendering=false;
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
                        if (scollToTop){
                            ifrm.scrollTo(0,0);
                        }
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

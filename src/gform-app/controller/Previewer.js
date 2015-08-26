define([
    'dojo/_base/lang',
    'dojo/query',
    'dijit/layout/ContentPane',
    '../util/topic',
    "dojo/_base/declare",
    "dojo/when",
    "dojo/text!./Previewer.html"
], function (lang, query, ContentPane, topic, declare, when, template) {


    return declare("cms.Previewer", [ContentPane], {
        pageStore: null,
        iframe: null,
        url: null,
        urlProperty: null,
        baseClass: "previewer",
        postCreate: function () {
            this.setContent(template);
            this.iframe = query("iframe", this.containerNode)[0];

            topic.subscribe("/page/navigate", lang.hitch(this, "onPageNavigate"));
            topic.subscribe("/focus", lang.hitch(this, "onPageFocus"));
            topic.subscribe("/updated", lang.hitch(this, "onPageUpdated"));
            topic.subscribe("/deleted", lang.hitch(this, "onPageDeleted"));
            topic.subscribe("/modify/update", lang.hitch(this, "onModifyUpdate"));
            topic.subscribe("/modify/cancel", lang.hitch(this, "onModifyCancel"));
        },
        onPageFocus: function (evt) {
            this.onEvent(evt);
        },
        onModifyCancel: function (evt) {
            this.onEvent(evt);
        },
        onPageUpdated: function (evt) {
            if (this.url && evt.url === this.url) {
                this.display(this.url);
            }
        },
        onPageDeleted: function (evt) {
            // TODO display nothing?
            // this.display("/page/"+evt.id);
        },
        onPageNavigate: function (evt) {
            //TODO move to general component or AppController
            var me = this;
            var query = {};
            if (evt.path) {
                // a link using the path not the id
                query.path = evt.path;
            } else if (evt.url) {
                query[this.urlProperty] = evt.url;
            } else {
                return;
            }

            var page = this.pageStore.query(query);
            when(page).then(function (pageResults) {
                var id = me.pageStore.getIdentity(pageResults[0]);
                var template = pageResults[0].template;
                if (template) {
                    topic.publish("/focus", {id: id, store: me.pageStore.name, source: this});
                }
            });
        },
        rendering: false,
        onEvent: function (evt) {
            if (evt && this.pageStore.name == evt.store) {
                var url = evt.store + "/" + evt.id;
                this.display(url);
            }
        },
        display: function (url) {
            console.log("render preview");
            try {
                // TODO improve error reporting
                var me = this;
                var scollToTop = this.url !== url;
                this.url = url;
                var renderer = this.createRenderer();
                when(renderer.render(url))
                    .then(function (result) {
                        me.rendering = false;
                        if (!result.noPage) {

                            var html = result.html;
                            if (result.errors && result.errors.length > 0) {
                                html = "<ul>";
                                result.errors.forEach(function (error) {
                                    html += "<li>" + error.message + "</li>";
                                });
                                html += "</ul>";
                            }
                            // remove preexisting amd define
                            me.displayHtml(html, scollToTop);

                        } else {
                            me.style.width = "0px";
                        }
                    }).otherwise(function (e) {
                        alert("cannot render " + e.stack)
                    });
            } catch (e) {
                alert("cannot render " + e.stack)
            }
        },
        displayHtml: function (html, scollToTop) {
            var ifrm = (this.iframe.contentWindow) ? this.iframe.contentWindow : (this.iframe.contentDocument.document) ? this.iframe.contentDocument.document : this.iframe.contentDocument;

            delete ifrm.define;
            ifrm.document.open();
            ifrm.document.write(html);
            ifrm.document.close();
            if (scollToTop) {
                ifrm.scrollTo(0, 0);
            }

        },
        onModifyUpdate: function () {
            if (this.url) {
                this.display(this.url);
            }
        }
    });
})
;

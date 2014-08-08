define([
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/_base/declare",
    "dojo/when",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Previewer.html"
], function (lang, topic, declare, when, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Previewer",[ _WidgetBase, _TemplatedMixin], {
        templateString: template,
        iframe: null,
        renderer: null,
        postCreate: function() {
          topic.subscribe("/page/focus", lang.hitch(this, "onPageSelected"));
        },
        onPageSelected: function(evt) {
            this.display("/page/"+evt.id);
        },
        display: function (url) {
            var me = this;
            this.url =url;
            when(me.renderer.render(url)).then(function (result) {
                var html=result.html;
                if (result.errors && result.errors.length>0) {
                    html="<ul>";
                    result.errors.forEach(function(error) {
                        html+="<li>"+error.message+"</li>";
                    });
                    html+="</ul>";
                }
                var ifrm = (me.iframe.contentWindow) ? me.iframe.contentWindow : (me.iframe.contentDocument.document) ? me.iframe.contentDocument.document : me.iframe.contentDocument;
                // remove preexisting amd define
                delete ifrm.define;
                ifrm.document.open();
                ifrm.document.write(html);
                ifrm.document.close();
            }).otherwise(function (e) {
                    alert("cannot render " + e.stack)
                });
        },
        refresh: function() {
            if (this.url) {
                this.display(this.url);
            }
        }
    });


});

define([
    "dojo/_base/declare",
    "dojo/when",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Previewer.html"
], function (declare, when, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Previewer",[ _WidgetBase, _TemplatedMixin], {
        templateString: template,
        iframe: null,
        renderer: null,
        display: function (url) {
            var me = this;
            this.url =url;
            when(me.renderer.render(url)).then(function (html) {
                var ifrm = (me.iframe.contentWindow) ? me.iframe.contentWindow : (me.iframe.contentDocument.document) ? me.iframe.contentDocument.document : me.iframe.contentDocument;
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

define([
    '../factory/AppFactory',
    'dojo/topic',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./app.html",
    "../config/main",
    "gform/controller/ConfirmDialog",
    'dojox/mvc/_atBindingExtension'


], function (AppFactory, topic, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, main) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);


            var me = this;
            var promise = new AppFactory(main).create();
            promise.then(function (container) {
                container.placeAt(me.domNode);
                container.startup();
            })
            window.appController = this;


        },
        followPreviewLink: function (url) {
            // TODO move to previewer
            topic.publish("/page/navigate", {url: url})
        }
    });


});

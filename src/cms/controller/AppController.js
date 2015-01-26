define([
	'dojo/query',
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


], function (query, AppFactory, topic, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, main) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);

			var loadingScreen = query('.loadingScreen')[0];
            var me = this;
			var appFactory = new AppFactory(main);
            var promise = appFactory.create();
            promise.then(function (container) {
				loadingScreen.style.display='none';
				me.domNode.style.display="block";
                container.placeAt(me.domNode);
				container.startup();
				appFactory.afterAttached();
            })
            window.appController = this;


        },
        followPreviewLink: function (url) {
            topic.publish("/page/navigate", {url: url})
        }
    });


});

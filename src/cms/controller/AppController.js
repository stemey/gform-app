define([
	'dojo/query',
	'../factory/AppFactory',
	'dojo/topic',
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./app.html",
	"gform/controller/ConfirmDialog",
	'dojox/mvc/_atBindingExtension'


], function (query, AppFactory, topic, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {


	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		postCreate: function () {
			this.inherited(arguments);

			window.appController = this;


		},
		start: function (gformAppConfig) {
			var appFactory = new AppFactory(gformAppConfig);
			var promise = appFactory.create();
			var loadingScreen = query('.loadingScreen')[0];
			var me = this;
			promise.then(function (container) {
				me.domNode.style.display = "block";
				loadingScreen.style.display = 'none';
				container.placeAt(me.domNode);
				container.startup();
				appFactory.afterAttached();
			})
		},
		followPreviewLink: function (url) {
			topic.publish("/page/navigate", {url: url})
		}
	});


});

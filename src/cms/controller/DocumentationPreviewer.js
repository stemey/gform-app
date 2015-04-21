define([
	'dijit/layout/_ContentPaneResizeMixin',
	'gform/layout/_InvisibleMixin',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/dom-attr',
	'dijit/_WidgetBase',
	"dojo/_base/declare",
	"dojo/text!./DocumentationPreviewer.html"
], function (ContentPaneResizeMixin, InvisibleMixin, TemplatedMixin, WidgetsInTemplateMixin, domAttr, _WidgetBase, declare, template) {


	return declare([_WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, ContentPaneResizeMixin], {
		templateString:template,
		previewerId: "documentation",
		iframe:null,
		postCreate: function () {
			domAttr.set(this.iframe,"src","cms/documentation/index.html");
			//this.iframe.set("href", "cms/documentation/index.html");
		}
	});
});

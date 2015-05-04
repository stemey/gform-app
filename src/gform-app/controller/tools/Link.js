define([
	'dijit/_CssStateMixin',
	'dojo/text!./Link.html',
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin"
], function (CssStateMixin, template, declare, _WidgetBase, _TemplatedMixin) {


	return declare("cms.Link", [ _WidgetBase, _TemplatedMixin, CssStateMixin], {
		baseClass: "dijitButton gformLink",
		templateString: template,
		label:"help",
		url:"",
		target:"_blank",
		iconClass: "dijitNoIcon",
		_setIconClassAttr: { node: "iconNode", type: "class" }
	})
});

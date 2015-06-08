define([
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare( [], {
		constructor: function(kwArgs) {
			lang.mixin(this,kwArgs);
		},
		resolve: function (obj) {
			if (obj && obj.type && obj.type=="array" && obj.element && obj.element.editor === "template-ref") {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				delete obj.editor;
				var cb = function (value) {
					obj.group = value.group;
					obj.group.type="object";
					obj.type="array";
					obj.template = value;
					delete obj.element;
					//obj.type = "object";
					//delete obj.editor;
					//delete obj.editor;// = "object";
				}
				// TODO template store needs to be configured
				return {store: this.templateStore, id: obj.element.template, setter: cb};
			} else {
				return false;
			}
		}
	});
});

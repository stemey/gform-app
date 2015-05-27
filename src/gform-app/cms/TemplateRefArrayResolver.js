define([
	"dojo/_base/declare"
], function (declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare( [], {
		resolve: function (obj) {
			if (obj && obj.type && obj.type=="array" && obj.element && obj.element.editor === "template-ref") {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var cb = function (value) {
					obj.group = value.group;
					obj.template = value.group.template;
					delete obj.element;
					//obj.type = "object";
					//delete obj.editor;
					//delete obj.editor;// = "object";
				}
				// TODO template store needs to be configured
				return {store: "/template", id: obj.element.template, setter: cb};
			} else {
				return false;
			}
		}
	});
});

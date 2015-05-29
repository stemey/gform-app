define([
	"dojo/_base/declare"
], function (declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare( [], {
		resolve: function (obj) {
			if (obj && obj.editor && obj.editor === "template-ref" && obj.template) {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var cb = function (value) {
					//obj.template = value;
					obj.type = "object";
					obj.template=value;
					obj.group=value.group;
					delete obj.editor;// = "object";
				}
				// TODO template store needs to be configured
				return {store: "/template", id: obj.template, setter: cb};
			} else {
				return false;
			}
		}
	});
});

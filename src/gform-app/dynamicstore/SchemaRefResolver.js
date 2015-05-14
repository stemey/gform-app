define([
	"dojo/_base/declare"
], function (declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare("cms.mongodb.SchemaRefResolver", [], {
		resolve: function (obj) {
			if (obj && obj.editor && obj.editor === "schema-ref" && obj.schema_id) {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var cb = function (value) {
					obj.group = value.group;
					obj.type = "object";
					delete obj.editor;// = "object";
				}
				return {store: obj.schema_store, id: obj.schema_id, setter: cb};
			} else {
				return false;
			}
		}
	});
});

define([
	"dojo/_base/declare"
], function (declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare("cms.mongodb.MultiEntityRefResolver", [], {
		resolve: function (obj) {
			if (obj && obj.editor && obj.editor === "multi-entity-ref") {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var cb = function (value) {
					obj.typeProperty = value.schema.typeProperty;
					obj.url = value.collection;
					obj.type = "multi-ref";
					delete obj.editor;
				}
				return {store: obj.store_id, id: obj.entity_id, setter: cb};
			} else {
				return false;
			}
		}
	});
});

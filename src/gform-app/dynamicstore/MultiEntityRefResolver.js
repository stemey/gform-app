define([
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare("cms.mongodb.MultiEntityRefResolver", [], {
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		idProperty: "id",
		resolve: function (obj) {
			var me = this;
			if (obj && obj.editor && obj.editor === "multi-entity-ref") {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var cb = function (value) {
					if (value.schema.typeProperty) {
						obj.typeProperty = value.schema.typeProperty;
						obj.type = "multi-ref";
						//obj.editor=obj.type;
					} else{
						obj.type = "ref";
						//obj.editor=obj.type;
					}
					obj.url = value[me.idProperty];
					delete obj.editor;
				}
				return {store: obj.store_id, id: obj.entity_id, setter: cb};
			} else {
				return false;
			}
		}
	});
});

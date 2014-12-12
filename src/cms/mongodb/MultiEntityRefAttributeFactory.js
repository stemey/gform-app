define([
	'gform/primitive/MultiReferenceAttributeFactory',
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (MultiReferenceAttributeFactory, lang, declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare("cms.mongodb.TemplateRefAttributeFactory",[MultiReferenceAttributeFactory], {

		id: "multi-entity-ref",
        handles: function(attribute, modelhandle){
            return true;
        },
		_convertSchema: function(attribute) {
			var newAttribute = {};
			lang.mixin(newAttribute,attribute);
			//newAttribute.url=attribute.collection.collection;
			//newAttribute.typeProperty=attribute.collection.schema.typeProperty;
			return newAttribute;
        },
        createModel: function (schema, plainValue) {
            return this.inherited(arguments,[this._convertSchema(schema),plainValue]);
		},
		create: function (schema, modelHandle, ctx) {
            return this.inherited(arguments,[this._convertSchema(schema),modelHandle,ctx]);
		}
	});
});

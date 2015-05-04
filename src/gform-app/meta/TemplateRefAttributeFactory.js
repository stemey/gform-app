define([
    'dojo/_base/lang',
    'gform/embedded/EmbeddedAttributeFactory',
    "dojo/_base/declare"
], function (lang, EmbeddedAttributeFactory, declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare("cms.meta.TemplateRefAttributeFactory",[EmbeddedAttributeFactory], {

		id: "template-ref",
        handles: function(attribute, modelhandle){
            return true;
        },
        _createEmbeddedAttribute: function(attribute) {
            var embeddedAttribute={};
            lang.mixin(embeddedAttribute, attribute);
            embeddedAttribute.group=attribute.template.group;
            // TODO we don't need a url attribute for the embedded template
            return embeddedAttribute;
        },
        createModel: function (schema, plainValue) {
            return this.inherited(arguments,[this._createEmbeddedAttribute(schema),plainValue]);
		},
		create: function (schema, modelHandle, ctx) {
            return this.inherited(arguments,[this._createEmbeddedAttribute(schema),modelHandle,ctx]);
		}
	});
});

define([
    'gform/embedded/MultiEmbeddedAttributeFactory',
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (MultiEmbeddedAttributeFactory, lang, declare) {

	// This factory creates an mebdded model and widget for the template-ref attribute.
	return declare("cms.meta.TemplateRefAttributeFactory",[MultiEmbeddedAttributeFactory], {

		id: "multi-template-ref",
        handles: function(attribute, modelhandle){
            return true;
        },
        _createEmbeddedAttribute: function(attribute) {
            var embeddedAttribute={};
            lang.mixin(embeddedAttribute, attribute);
            embeddedAttribute.groups=attribute.templates.map(function(template) {
                return template.group;
            });
            embeddedAttribute.typeProperty="__type";
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

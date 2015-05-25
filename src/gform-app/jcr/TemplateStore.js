define([
	'../meta/TemplateSchemaTransformer',
	'../factory/schema/SchemaStore',
	"dojo/_base/declare"
], function (TemplateSchemaTransformer, SchemaStore, declare) {

	return declare([SchemaStore], {
		constructor: function (kwArgs) {
			this.transformer = new TemplateSchemaTransformer(kwArgs);
		}
	});


});

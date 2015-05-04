define([
	'./SchemaTransformer',
	'../factory/schema/SchemaStore',
	"dojo/_base/declare"
], function (SchemaTransformer, SchemaStore, declare) {

	return declare([SchemaStore], {
		constructor: function (kwArgs) {
			this.transformer = new SchemaTransformer(kwArgs.ctx)
		}
	});


});

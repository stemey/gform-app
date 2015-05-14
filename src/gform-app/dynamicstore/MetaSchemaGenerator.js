define([
	'../util/MetaSchemaGenerator',
	'./SchemaGenerator',
	"dojo/_base/declare"
], function (MetaSchemaGenerator, SchemaGenerator, declare) {

	return declare([MetaSchemaGenerator], {
		schemaGenerator: new SchemaGenerator()
	});


});

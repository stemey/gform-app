define([
	'dojo/_base/declare',
	'gform/schema/meta',
	"dojo/_base/array"
], function (declare, metaHelper, array) {

	return declare([], {
		mapping:{
			'string':'string',
			'number':'number',
			'boolean':'boolean',
			'date':'date',
			'enum':'enum'
		},
		excludedEditors:['schema-ref','template-ref'],
		_extractFromAttributes: function (attributes) {
			var columns = [];
			array.forEach(attributes, function (attribute) {
				if (this.excludedEditors.indexOf(attribute.editor)<0 && !attribute.groups && !attribute.elements && !attribute.group && !attribute.element) {
					var column = {
						id: attribute.code,
						field: attribute.code,
						name: attribute.label || attribute.code,
						dataType: this.mapping[attribute.type] || "string",// TODO make sure datatype is correct
						// doesn't seem to work
						//disabledConditions: ["contains", "notcontains"],
						autoComplete: true
					}
					if ( attribute.enumOptions) {
						column.enumOptions = attribute.enumOptions;
					}
					if ( attribute.formatter) {
						column.formatter = attribute.formatter;
					}
					if ( attribute.parser) {
						column.parser = attribute.parser;
					}
					columns.push(column);
				}
			}, this);
			return columns;
		},
		convert: function (gformSchema, excludedProperties) {
			var attributes = metaHelper.collectAttributesWithoutAdditional(gformSchema, excludedProperties);
			return this._extractFromAttributes(attributes);
		}
	});
});



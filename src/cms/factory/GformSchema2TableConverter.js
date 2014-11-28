define([
	'dojo/date/stamp',
	'dojo/_base/declare',
	'gform/schema/meta',
	"dojo/_base/array"
], function (dateStamp, declare, metaHelper, array) {

	return declare([], {
		mapping:{
			'string':'string',
			'number':'number',
			'boolean':'boolean',
			'date':'date'
		},
		excludedEditors:['schema-ref','template-ref'],
		_extractFromAttributes: function (attributes) {
			var columns = [];
			array.forEach(attributes, function (attribute) {
				if (this.excludedEditors.indexOf(attribute.editor)<0 && !attribute.groups && !attribute.elements && !attribute.group && !attribute.element) {
					var column = null;
					if (this['_convert_'+attribute.type]) {
						column = this['_convert_'+attribute.type](attribute);
					} else {
						column=this._create(attribute);
					}
					columns.push(column);
				}
			}, this);
			return columns;
		},
		_create: function(attribute) {
			var column = {
				id: attribute.code,
				field: attribute.code,
				name: attribute.label || attribute.code,
				dataType: this.mapping[attribute.type] || "string",// TODO make sure datatype is correct
				autoComplete: true
			}
			if ( attribute.formatter) {
				column.formatter = attribute.formatter;
			}
			if ( attribute.parser) {
				column.parser = attribute.parser;
			}
			return column;
		},
		_convert_date: function(attribute) {
			var column = this._create(attribute);
			column.dataType="date";
			column.parser = function(value) {
				var isoDateString = value;
				if (typeof value !== "string") {
					isoDateString = dateStamp.toISOString(new Date(value), {
						selector: "date"
					});
				}
				return isoDateString;
			}
			return column;

		},
		_convert_string: function(attribute) {
			var column = this._create(attribute);
			if (attribute.values) {
				var mapping = {};
				var rmapping = {};
				column.dataType="enum";
				column.enumOptions=attribute.values.map(function(o) {
					if (o.value) {
						mapping[o.label]= o.value;
						rmapping[o.value]= o.label;
						return o.label;
					} else {
						return o;
					}
				});
				column.parser = function(label) {
					return mapping[label] || label;
				};
				column.formatter = function(entity) {
					var value = entity[attribute.code]
					return rmapping[value] || value;
				};
			}
			return column;
		},
		convert: function (gformSchema, excludedProperties) {
			var attributes = metaHelper.collectAttributesWithoutAdditional(gformSchema, excludedProperties);
			return this._extractFromAttributes(attributes);
		}
	});
});



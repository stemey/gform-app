define([
	'../../dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {

	var idConverter = function (columnId, value) {
		return value;
	}

	return declare([], {
		selectIsStartsWith: true,
		convertValue: idConverter,
		conditions: {
			"string": ["contain", "equal", "startWith", "endWith", "notEqual", "isEmpty"],
			"number": ["equal", "greater", "less", "greaterEqual", "lessEqual", "notEqual", "isEmpty"],
			"date": ["equal", "before", "after", "range", "isEmpty"],
			//"time": ["equal", "before", "after", "range", "isEmpty"],
			"enum": ["equal", "notEqual", "isEmpty"],
			"boolean": ["equal", "isEmpty"]
		},
		transform: function (gquery, converterMap) {
			// TODO this is pretty hacky!
			this.convertValue = this.createColumnValueConverter(converterMap);
			if (!gquery) {
				return {};
			} else if (gquery.op === "or") {
				var conditions = this.conditionList(gquery.data);
				return {$or: conditions}
			} else if (gquery.op === "and") {
				var conditions = this.conditionList(gquery.data);
				var and = {};
				conditions.forEach(function (condition) {
					lang.mixin(and, condition);
				});
				return and;
			} else {
				// simple query
				var query = {};
				for (var key in gquery) {
					query[key] = key, this.convertQueryValue(gquery[key]);
				}
				return query;
			}
			this.convertValue = idConverter;
		},
		createColumnValueConverter: function (convertMap) {
			return function (columnId, columnValue) {
				var parser = convertMap[columnId];
				if (parser) {
					return parser(columnValue);
				} else {
					return columnValue;
				}
			}
		},
		convertQueryValue: function (value) {
			if (typeof value === "object") {
				if ("$in" in value) {
					return value;
				} else if ("$regex" in value) {
					return value;
				} else {
					return value.toString();
				}
			} else {
				return value;
			}
		},
		conditionList: function (data, converter) {
			return data.map(function (d) {
				return this.condition(d);
			}, this);
		},
		condition: function (gcondition, not) {
			var op = "transform" + gcondition.op.substring(0, 1).toUpperCase() + gcondition.op.substring(1, gcondition.op.length);
			if (this[op]) {
				return this[op](gcondition.data, not)
			} else {
				throw new Error("operation " + op + " is not supported.");
			}
		},
		transformEqual: function (operands, not) {
			var mcondition = {};
			var value = this.convertValue(operands[0].data, operands[1].data);
			mcondition[operands[0].data] = not ? {$ne: value} : value;
			return mcondition;
		},
		transformIsEmpty: function (operands) {
			var prop = operands[0].data;
			var c1 = {};
			c1[prop] = null;
			var c2 = {};
			c2[prop] = "";
			return {$or: [c1, c2]};
		},
		transformAnd: function (operands) {
			var c1 = this.condition(operands[0]);
			var c2 = this.condition(operands[1]);
			var mcondition = {"$and": [c1, c2]};
			return mcondition;
		},
		transformContain: function (operands, not) {
			var mcondition = {};
			mcondition[operands[0].data] = {$regex: this.value(operands)};
			return mcondition;
		},
		transformStartWith: function (operands, not) {
			var mcondition = {};
			mcondition[operands[0].data] = {$regex: "^" + this.value(operands)};
			return mcondition;
		},
		transformEndWith: function (operands, not) {
			var mcondition = {};
			mcondition[operands[0].data] = {$regex: this.value(operands) + "$"};
			return mcondition;
		},
		transformNot: function (operands) {
			return this.condition(operands[0], true);
		},
		transformGreater: function (operands) {
			var mcondition = {};
			mcondition[operands[0].data] = this.not({$gt: this.value(operands)}, not);
			return mcondition;
		},
		transformGreaterEqual: function (operands) {
			var mcondition = {};
			mcondition[operands[0].data] = {$gte: this.value(operands)};
			return mcondition;
		},
		transformLess: function (operands) {
			var mcondition = {};
			mcondition[operands[0].data] = {$lt: this.value(operands)};
			return mcondition;
		},
		transformLessEqual: function (operands) {
			var mcondition = {};
			mcondition[operands[0].data] = {$lte: this.value(operands)};
			return mcondition;
		},
		value: function(operands) {
			var key = operands[0].data;this.converter
			return this.convertValue(key,operands[1].data);
		}

	});
});

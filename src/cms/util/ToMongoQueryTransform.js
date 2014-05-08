define([
    '../../dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {

    return declare([  ], {
        selectIsStartsWith: true,
        transform: function (gquery) {
            if (gquery.op === "or") {
                var conditions = this.conditions(gquery.data);
                return {$or: conditions}
            } else if (gquery.op === "and") {
                var conditions = this.conditions(gquery.data);
                var and = {};
                conditions.forEach(function (condition) {

                    lang.mixin(and, condition);
                });
                return and;
            } else {
                // simple query
                var query = {};
                for (var key in gquery) {
                    query[key] = this.convertQueryValue(gquery[key]);
                }
                return query;
            }
        },
        convertQueryValue: function (value) {
            if (typeof value === "object") {
                if ("$in" in value) {
                    return value;
                } else if ("$regex" in value) {
                    return value;
                } else if (value.test) {
                    return this.convertRegexToQuery(value);
                } else {
                    return value.toString();
                }
            } else if (value.length > 0 && value.substring(value.length - 1) == "*") {
                return this.convertRegexToQuery(value);
            } else {
                return value;
            }
        },
        convertRegexToQuery: function (regexValue) {
            // assuming a regex that works like startsWith : "start*". This is the way it is used by dijit.form._AutoCompleterMixin
            var str = regexValue.toString();
            if (str.length == 0) {
                return "";
            } else {
                str = "."+str;
                return {$regex: this.selectIsStartsWith ? "^" + str : str};
            }
        },
        conditions: function (data) {
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
            var value = operands[1].data;
            mcondition[operands[0].data] = not ? {$ne: value} : value;
            return mcondition;
        },
        transformContain: function (operands) {
            var mcondition = {};
            mcondition[operands[0].data] = {$regex: operands[1].data};
            return mcondition;
        },
        transformStartsWith: function (operands) {
            var mcondition = {};
            mcondition[operands[0].data] = {$regex: "^" + operands[1].data};
            return mcondition;
        },
        transformEndsWith: function (operands) {
            var mcondition = {};
            mcondition[operands[0].data] = {$regex: operands[1].data + "$"};
            return mcondition;
        },
        transformNot: function (operands) {
            return this.condition(operands[0], true);
        }
    });
});
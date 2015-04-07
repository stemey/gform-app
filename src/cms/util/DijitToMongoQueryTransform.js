define([
	"dojo/_base/declare"
], function (declare) {

	return declare([], {
		transform: function (oquery) {
			if (!oquery) {
				return oquery;
			} else {
				// simple query
				var query = {};
				for (var key in oquery) {
					query[key] = this.convertQueryValue(oquery[key]);
				}
				return query;
			}
		},
		convertQueryValue: function (value) {
			if (typeof value === "object") {
				if (typeof value.test == "function") {
					return this.convertRegexToQuery(value);
				} else {
					return value;
				}
			} else {
				return value;
			}
		},
		convertRegexToQuery: function (regex) {
			// assuming a regex that works like startsWith : "start*". This is the way it is used by dijit.form._AutoCompleterMixin
			var regexValue = regex.toString();
			var str = regexValue.substring(0, regexValue.length - 1);
			str = str.replace("*", ".*");
			return {$regex: this.selectIsStartsWith ? "^" + str : str};
		}
	});
});

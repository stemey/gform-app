define([
	'gform/schema/meta'
], function (meta) {


	return function (requiredAttributes) {
		return function (modelHandle, force) {
			if (!force) {
				return [];
			}
			var plainValue = modelHandle.getPlainValue();
			var partial = modelHandle.parent.parent.getPlainValue().partial;
			var errors = [];
			var attributes = meta.collectAttributes(plainValue);
			var results = attributes.filter(function (a) {
				return a.code == "url" && a.type == "string";
			});
			if (results.length == 0 && !partial) {
				errors.push({path: "attributes", message: "you need to provide a  url attribute"});
			}
			return errors;
		};
	};


});

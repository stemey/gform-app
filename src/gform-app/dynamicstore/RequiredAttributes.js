define([
	'dojo/_base/declare',
	'gform/schema/meta'
], function (declare, meta) {

	/**
	 * requiredAttributes=[{code:"",type:""},{code:"",type:""}]
	 *
	 */
	return declare("RequiredAttributes", [], {
		constructor: function (value) {
			this.requiredAttributes=value;
		},
		getPlainValue: function(model) {
			return model.getPlainValue();
		},
		getRequiredAttributes: function(model) {
			return this.requiredAttributes;
		},
		validate: function (model, force) {
			if (!force) {
				return [];
			}
			var requiredAttributes = this.getRequiredAttributes(model);
			var requiredCodes = requiredAttributes.map(function (e) {
				return e.code;
			})
			var plainValue = this.getPlainValue(model);
			var errors = [];
			var attributes = meta.collectAttributes(plainValue);
			var attributesMap = {};
			attributes.forEach(function (a) {
				return attributesMap[a.code] = a;
			});

			var missingCodes = requiredCodes.filter(function (code) {
				return !(code in attributesMap);
			})
			if (missingCodes.length > 0) {
				errors.push({path: "", message: "missing attributes: " + missingCodes.join(" ,")});
			} else {
				var wronglyTyped = requiredAttributes.filter(function (r) {
					var found = attributesMap[r.code];
					return found && r.type && found.type != r.type
				})
				if (wronglyTyped.length > 0) {
					var error = wronglyTyped.map(function (t) {
						return t.code + ": " + t.type;
					}).join(" ,");
					errors.push({path: "", message: "following attributes have the wrong type: " + error});
				}
			}

			return errors;

		}
	});
});

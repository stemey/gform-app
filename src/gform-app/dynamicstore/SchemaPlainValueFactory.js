define(['dojo/_base/lang',
	'dojo/_base/declare'], function (lang, declare) {
	return declare([], {
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		// TODO the id attribute's props are the id from the store that this model is stored in. That information needs to be configured by the DyanmicResourceFactory
		createMultiSchema: function (model, ctx) {
			var typeProperty;
			var schemaStore;
			if (model.schema.element) {
				// ref list
				typeProperty = model.getModelByPath(".typeProperty").getPlainValue();
				schemaStore = ctx.getStore(model.schema.element.url);
			} else {
				// ref list element
				typeProperty = model.getModelByPath("..typeProperty").getPlainValue();
				schemaStore = ctx.getStore(model.schema.url);
			}
			var schema = {
				"group": {
					"editor": "listpane",
					"attributes": [
						{
							"code": this.idProperty,
							"type": this.idType,
                            "editor":this.idType,
							"disabled":!this._isAssignableId(model)
						},
						{
							"code": typeProperty,
							"editor": "string",
							"type": "string",
							"visible": false
						}
					]
				}
			};
			return schema;

		},
		_isAssignableId: function(model) {
			var assignabledIdModel = model.getModelByPath("...assignableId");
			if (assignabledIdModel==null) {
				assignabledIdModel = model.getModelByPath(".....assignableId");
			}
			return assignabledIdModel.getPlainValue();
		},
		createSingleSchema: function (model, ctx) {
			var schema = {
				"group": {
					"editor": "listpane",
					"attributes": [
						{
							"code": this.idProperty,
							"editor": this.idType,
							"disabled":!this._isAssignableId(model)
						}
					]
				}
			};
			return schema;

		}
	});
})
;


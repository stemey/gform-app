define([], function () {
	return {
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
					"editor":"listpane",
					"attributes": [
						{
							"code": "_id",
							"editor": "string",
							"type": "string"
						},
						{
							"code": typeProperty,
							"editor":"string",
							"type": "string",
							"visible":false
						}
					]
				}
			};
			return schema;

		},
		createSingleSchema: function (model, ctx) {
			var schema = {
				"group": {
					"editor":"listpane",
					"attributes": [
						{
							"code": "_id",
							"editor": "string",
							"type": "string"
						}
					]
				}
			};
			return schema;

		}
	}
});

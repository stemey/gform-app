define([
	'gform/schema/meta',
	'dojo/Deferred',
	'gform/primitive/MappedSelectAttributeFactory',
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (meta, Deferred, MappedSelectAttributeFactory, lang, declare) {

	return declare("cms.mongodb.SchemaAttributeFactory", [MappedSelectAttributeFactory], {

		id: "schema-collection",
		handles: function (attribute) {
			return attribute.mapped_attribute;
		},

		create: function (attribute, modelHandle, ctx) {
			this.ctx = ctx;
			return this.inherited(arguments);
		},

		_watchMappedAttribute: function (modelHandle, attribute, select) {
			var model = modelHandle.parent.getModelByPath(attribute.mapped_attribute);
			model.watchPath(attribute.mapped_attribute,
				lang.hitch(this, "_onMappedAttributeChanged", modelHandle, select, attribute), "value");
		},

		_createMappedOptions: function (modelHandle, attribute) {
			var mappedModel = modelHandle.getModelByPath(attribute.mapped_attribute);
			var schema = mappedModel.schema;
			var mappedValue = mappedModel.getPlainValue();
			var store = this.ctx.getStore(schema.url);
			//var schemaStore = this.ctx.getStore("/mdbschema");
			var deferred = new Deferred();
			// TODO mapped value should be the id
			store.get(mappedValue).then(function (entity) {
				var options = [];
				var type = entity.schema.schemaType;
				if (entity.schema.schema) {
					var id = entity.schema.schema;
					options.push({label: ""+id, value: id});
				} else if (entity.schema.schemas) {
					options = entity.schema.schemas.map(function (id) {
						return {label: ""+id, value: id}
					});
				}
				deferred.resolve(options);
			});
			return deferred;

		}
	});
});

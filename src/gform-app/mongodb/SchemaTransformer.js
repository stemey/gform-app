define([
	'./SchemaRefResolver',
	'./MultiEntityRefResolver',
	'../util/SchemaResolver',
	'dojo/when',
	'dojo/Deferred',
	'dojo/_base/declare'
], function (SchemaRefResolver, MultiEntityRefResolver, SchemaResolver, when, Deferred, declare) {
// module:
//		gform/util/Resolver


	return declare([], {
		idProperty: null,
		ctx:null,
		constructor: function (kwArgs) {
			this.ctx=kwArgs.ctx;
			this.idProperty=kwArgs.idProperty;
		},
		transform: function (schema, skipResolve) {
			var d = new Deferred();
			var resolver = new SchemaResolver(this.ctx);
			resolver.addResolver(new MultiEntityRefResolver({idProperty:this.idProperty}))
			resolver.addResolver(new SchemaRefResolver())
			// TODO schemaResolver modifies input so we need to clone here
			var clonedSchema = JSON.parse(JSON.stringify(schema));
			p = resolver.resolve(clonedSchema);
			var me = this;
			when(p).then(function () {
				d.resolve(clonedSchema);
			}).otherwise(function (e) {
				d.reject(e)
			});
			return d;
		}

	})
});


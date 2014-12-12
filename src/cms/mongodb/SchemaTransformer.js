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


	return declare("cms.mongodb.SchemaTransfomer", [], {
		idType: null,
		idProperty: null,
		baseUrl: null,
		constructor: function (ctx) {
			this.ctx = ctx;
		},
		transform: function (schema, skipResolve) {
			var d = new Deferred();
			var resolver = new SchemaResolver(this.ctx);
			resolver.addResolver(new MultiEntityRefResolver(resolver))
			resolver.addResolver(new SchemaRefResolver(resolver))
			p = resolver.resolve(schema);
			var me = this;
			when(p).then(function () {
				// TODO remove dependency on schema property and group property
				d.resolve(schema.group);

			}).otherwise(function (e) {
				d.reject(e)
			});
			return d;
		}

	})
});


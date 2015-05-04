define([
	'dojo/_base/Deferred',
	"dojo/_base/declare",
	'gform/util/Resolver'
], function (Deferred, declare, Resolver) {

	/**
	 * store to store our schemas.
	 * schema that provide a meta schema for the store.
	 *
	 */

	var resolver = new Resolver();
	return declare([], {

		create: function (ctx, config) {
			var deferred = new Deferred();
			require(["dojo/text!" + config.module], function (schemaString) {
				var schema = JSON.parse(schemaString);
				var schemaP = resolver.resolve(schema, config.module);
				schemaP.then(function () {
					deferred.resolve(schema);
				}).otherwise(function (e) {
					deferred.reject(e);
				})
			});
			return deferred;

		}
	});


});

define([
	'dojo/_base/Deferred',
	"dojo/_base/declare"
], function (Deferred, declare) {

	/**
	 * store to store our schemas.
	 * schema that provide a meta schema for the store.
	 *
	 */

	return declare([], {
		create: function (ctx, config) {
			var deferred = new Deferred();
			require(["dojo/text!" + config.module], function (schemaString) {
				deferred.resolve(JSON.parse(schemaString));
			});
			return deferred;

		}
	});


});

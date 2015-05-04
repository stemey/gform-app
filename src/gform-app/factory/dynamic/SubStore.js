define([
	'dojo/_base/lang',
	'dojo/Deferred',
	"dojo/_base/declare"
], function (lang, Deferred, declare) {


	return new declare([], {
		schemaStore: this.schemaStore,
		meta: null,
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		get: function (id) {
			return this.schemaStore.get(id);
		},
		query: function (q) {
			var p = this.schemaStore.query(q);
			var d = new Deferred();
			var schemaStore=this.schemaStore;
			var meta = this.meta;
			p.then(function (results) {
				var filtered = results.filter(function (e) {
					var id = schemaStore.getIdentity(e);
					return meta.schema.schemas.indexOf(id) >= 0;
				});
				d.resolve(filtered);
			}).otherwise(d.reject);
			return d;
		}
	});
});

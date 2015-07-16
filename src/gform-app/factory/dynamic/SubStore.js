define([
    'dojo/when',
    'dojo/_base/lang',
	'dojo/Deferred',
	"dojo/_base/declare"
], function (when, lang, Deferred, declare) {


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
			when(p).then(function (results) {
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

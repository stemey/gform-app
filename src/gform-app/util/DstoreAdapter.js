define([
	'dojo/store/Observable',
	'dstore/legacy/DstoreAdapter',
	"dojo/_base/declare"
], function (Observable, DstoreAdapter, declare) {


	return declare([DstoreAdapter, Observable], {
		query: function (query, options) {
			var filter = new this.store.Filter();
			Object.keys(query).forEach(function (key) {
				if (query[key] && typeof query[key] === "object" && query[key].$in) {
					filter = filter.in(key, query[key].$in);
				} else if (query[key] && typeof query[key].test === "function") {
					filter = filter.match(key, query[key]);
				} else {
					filter = filter.eq(key, query[key]);
				}
			})
			return this.inherited(arguments,[filter, options]);
		}
	});
});

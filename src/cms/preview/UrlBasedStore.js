define([
	"dojo/_base/declare",
    "gform/util/restHelper"
], function(declare, restHelper){


	
	return declare( [ ], {
		constructor: function(store) {
			this.store=store;
		},
		findByUrl: function(url) {
			var id = restHelper.decompose(url).id;
			return this.store.get(id);
		}
	});

});
	

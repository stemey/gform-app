define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"gform/util/restHelper"
], function(declare, lang, restHelper){


	
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
	

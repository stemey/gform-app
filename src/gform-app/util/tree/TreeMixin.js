define([
	"dojo/_base/declare"
], function (declare) {

	return declare([], {
		getChildren: function(parentItem) {
			var id = this.getIdentity(parentItem);
			var parentProperty = this.parentProperty;
			var query ={}
			query[parentProperty]=id;
			// TODO configure name property
			return this.query(query,{sort:[{attribute:"index", descending: false},{attribute:"name", descending: false}]});
		}	});

});

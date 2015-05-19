define([
	'dijit/tree/ObjectStoreModel',
	"dojo/_base/declare"
], function (ObjectStoreModel, declare) {

	return declare([ObjectStoreModel], {
		constructor: function () {
			this.query = {};
			this.query[this.store.parentProperty] = null;
		}
	});

});

define([
	'dojo/topic',
	"dojo/_base/declare"
], function (topic, declare) {

	return declare([], {

		add: function (store) {
			var p = this.inherited(arguments);
			topic.publish("/store/new", {source: this, store: store[this.idProperty]});
			return p;
		},
		put: function (store) {
			var p = this.inherited(arguments);
			topic.publish("/store/update", {source: this, store: store[this.idProperty]});
			return p;
		},
		remove: function (store) {
			var p = this.inherited(arguments);
			topic.publish("/store/remove", {source: this, store: store[this.idProperty]});
			return p;
		}
	});

});

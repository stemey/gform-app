define([
	'dojo/request/xhr',
	'dijit/form/Button',
	'./StoreSensitiveMixin',
	"dojo/_base/declare",
	"dijit/form/FilteringSelect"
], function (xhr, Button, StoreSensitiveMixin, declare) {


	return declare([Button,StoreSensitiveMixin], {
		ctx: null,
		constructor: function () {
		},
		onClick: function () {
			xhr.put(this.url, {});
		}
	})
});

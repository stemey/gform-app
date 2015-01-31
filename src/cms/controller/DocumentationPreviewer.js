define([
	'dijit/layout/ContentPane',
	"dojo/_base/declare"
], function (ContentPane, declare) {


	return declare([ContentPane], {
		previewerId: "documentation",
		postCreate: function () {
			this.set("href", "cms/documentation/index.html");
		}
	});
});

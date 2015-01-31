define([
	'../controller/DocumentationPreviewer',
	"dojo/_base/declare"
], function (DocumentationPreviewer, declare) {


	return declare([], {
		create: function (ctx, config) {
			return new DocumentationPreviewer();
		}
	});


});

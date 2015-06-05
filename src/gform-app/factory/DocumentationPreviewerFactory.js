define([
	'../controller/DocumentationPreviewer',
	"dojo/_base/declare"
], function (DocumentationPreviewer, declare) {


	return declare([], {
		create: function (ctx, config) {
			ctx.addView({label: config.title || config.id, id: config.id, store:config.id, index:0});
			return new DocumentationPreviewer();
		}
	});


});

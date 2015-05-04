define([
	'dojo/_base/lang',
	'../controller/tools/MultiSchemaCreateButton',
	"dojo/_base/declare"
], function (lang, MultiSchemaCreateButton, declare) {


	return declare([], {
		create: function (ctx, config) {
			var props = {ctx: ctx};
			lang.mixin(props, config);

			return new MultiSchemaCreateButton(props)
		}
	});


});

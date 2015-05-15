define([
	'gform/Context',
	'dojo/_base/lang',
	'../controller/SchemaPreviewer',
	"dojo/_base/declare"
], function (Context, lang, SchemaPreviewer, declare) {


	return declare([], {
		create: function (ctx, config) {
			var ectx = new Context();
			ectx.storeRegistry = ctx.storeRegistry;
			ectx.schemaRegistry = ctx.schemaRegistry;
			ectx.opener = {
				openSingle: function () {
					alert("opening relations is not supported in preview");
				}, createSingle: function () {
					alert("opening relations is not supported in preview");
				}
			}
			var props = {ctx: ectx};
			lang.mixin(props, config);
			return new SchemaPreviewer(props);
		}
	});


});

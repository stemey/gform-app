define([
	'../CmsContext',
	'dojo/_base/lang',
	'../controller/SchemaPreviewer',
	"dojo/_base/declare"
], function (CmsContext, lang, SchemaPreviewer, declare) {


	return declare([], {
		create: function (ctx, config) {
			var ectx = new CmsContext();
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
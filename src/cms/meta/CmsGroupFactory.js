define([
    "dojo/_base/lang",
	"dojo/_base/declare"
], function (lang, declare) {

	return declare("cms.meta.CmsGroupFactory",[], {

		id: "cmsgroup",
        schemaProperty:"group",
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
        createModel: function (schema, plainValue) {
			return this.editorFactory.createGroupModel(schema[this.schemaProperty], plainValue);
		},
		create: function (group, modelHandle, ctx) {
            return this.editorFactory.create(group[this.schemaProperty], modelHandle, ctx);
		}
	});
});

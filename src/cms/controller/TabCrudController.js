define(['dojo/_base/declare',
	'gform/controller/TabCrudController'], function (declare, TabCrudController) {

	return declare([TabCrudController], {
		postCreate: function () {
			this.editorFactory = this.store.editorFactory;
			this.inherited(arguments);
		},
		getSchema: function (url) {
			var schemaUrl = this.store.templateStore ? this.store.templateStore + "/" + url : url;
			//return this.editor.ctx.getSchema(schemaUrl);
			return this.inherited(arguments, [schemaUrl]);
		},
		getFallbackSchema: function () {
			return {
				additionalProperties: {
					code: "add"
				},
				attributes: [
					{
						code: "add",
						type: "any"
					}
				]
			}
		}
	});
});

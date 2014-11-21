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
			// TODO move to store?
			return {
				additionalProperties: {
					code: "add"
				},
				editor:"single",
				attribute:
					{
						code: "add",
						description:"This is the fallback editor. <br>Either the schema was not found or it did not include the required id and/or type properties.<br> In the former case you should adjust the type property's value.<br>In the latter case you need to fix the schema.",
						label:"entity as json",
						type: "any"
					}

			}
		}
	});
});

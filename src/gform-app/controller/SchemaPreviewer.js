define([
	'../dynamicstore/SchemaTransformer',
	'dojo/_base/lang',
	'gform/Editor',
	"dojo/_base/declare"
], function (SchemaTransformer, lang, Editor, declare) {


	return declare("cms.SchemaPreviewer", [Editor], {
		ctx: null,
		idProperty:null,
		baseClass: "gformSchemaPreviewer",
		onEntityFocus: function (evt) {
			var store = this.ctx.getStore(evt.store);
			this.set("editorFactory", store.editorFactory);
			store.get(evt.id).then(lang.hitch(this, "display", store));
		},
		onModifyUpdate: function (evt) {
			var store = this.ctx.getStore(evt.store);
			this.display(evt.store, evt.value);
		},
		onEntityDeleted: function (evt) {
		},
		onEntityUpdated: function (evt) {
		},
		onEntityRefresh: function (evt) {
		},
		display: function (store, entity) {
			// TODO get transformer from store?
			var transformer = new SchemaTransformer({ctx:this.ctx, idProperty:this.idProperty});
			var me = this;
			try {
				transformer.transform(entity.group).then(function (schema) {
					me.setMetaAndDefault(schema);
				});
			} catch (e) {
				console.log("error during rendering schema preview ", e);
			}
		},
		refresh: function () {
		}
	});
});

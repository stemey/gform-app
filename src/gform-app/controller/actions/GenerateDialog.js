define([
	'../../config',
	'../../util/topic',
	'dojo/request/xhr',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/_base/declare',
	'dojo/text!./GenerateDialog.html',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetBase',
	'dijit/form/Button',
	'gform/Editor'
], function (config, topic, xhr, WidgetsInTemplateMixin, declare, template, TemplatedMixin, WidgetBase) {

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		templateString: template,
		button: null,
		editor: null,
		schema: null,
		editorFactory: null,
		ctrl: null,
		closeFn: null,
		postCreate: function () {
			this.inherited(arguments);
			this.editor.set("editorFactory", this.editorFactory);
			this.editor.set("meta", this.schema);
			this.editor.modelHandle.initDefault(false);
			this.button.onClick = this.onClick.bind(this);
		},
		onSuccess: function (result) {
			this.closeFn();
			var id = this.ctrl.getId();
			this.ctrl.reload();
			topic.publish("/updated", {store: this.ctrl.store.name, id: id});
			/*			var newMeta = result.entity;
			 if (result.meta.schema) {
			 var schemas =[];
			 if (result.schema.schema) {
			 schemas.push(result.schema.schema);
			 }else{
			 schemas=result.schema.schemas;
			 }
			 schemas.forEach(function(schema) {
			 this.ctrl.ctx.schemaRegistry.
			 topic.publish("/updated", {store: "/mdbschema", id: result.schema.schema});
			 })
			 }*/

		},
		onError: function (e) {
			this.closeFn();
			console.log("cannot generate schema " + e);
			alert("error during schema generation");
		},
		onClick: function () {
			var me = this;
			if (this.editor.modelHandle.errorCount === 0) {
				var entity = this.ctrl.editor.getPlainValue();
				var params = this.editor.getPlainValue();
				xhr.put(config.baseUrl + "task/generate/" + entity._id, {data: params}).then(
					this.onSuccess.bind(this),
					this.onError.bind(this));
			}
		}
	});
});

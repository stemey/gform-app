define([
	'../../util/topic',
	'dojo/request/xhr',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/_base/declare',
	'dojo/text!./GenerateDialog.html',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetBase',
	'dijit/form/Button',
	'gform/Editor'
], function (topic, xhr, WidgetsInTemplateMixin, declare, template, TemplatedMixin, WidgetBase) {

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		templateString: template,
		button: null,
		editor: null,
		schema: null,
		editorFactory: null,
		ctrl: null,
		url: "http://localhost:3001/task/generate/",
		postCreate: function () {
			this.inherited(arguments);
			this.editor.set("editorFactory", this.editorFactory);
			this.editor.set("meta", this.schema);
			this.editor.modelHandle.initDefault(false);
			this.button.onClick = this.onClick.bind(this);
		},
		onSuccess: function () {
			this.close();
			var id = this.ctrl.getId();
			this.ctrl.reload();
			topic.publish("/updated", {store: this.ctrl.store, id: id});
		},
		onError: function (e) {
			this.close();
			console.log("cannot generate schema " + e);
			alert("error during schema generation");
		},
		onClick: function () {
			var me = this;
			if (this.editor.modelHandle.errorCount === 0) {
				var entity = this.ctrl.editor.getPlainValue();
				var params = this.editor.getPlainValue();
				xhr.put(this.url + entity._id, {data:params}).then(
					this.onSuccess.bind(this),
					this.onError.bind(this));
			}
		}
	});
});

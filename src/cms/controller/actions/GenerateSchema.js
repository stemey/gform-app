define([
	'dijit/popup',
	'./GenerateDialog',
	'dijit/form/Button',
	'gform/createLayoutEditorFactory',
	'gform/Editor',
	'dijit/form/DropDownButton',
	'dijit/TooltipDialog',
	'dojo/request/xhr',
	'dojo/i18n!cms/nls/messages',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (popup, GenerateDialog, Button, createLayoutEditorFactory, Editor, DropDownButton, TooltipDialog, xhr, messages, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		buttonType: DropDownButton,
		messageModule: "actions.generateSchema",
		createButton: function () {
			var button = this.inherited(arguments);
			var dialog = new TooltipDialog();
			button.set("dropDown", dialog);
			var gform = {
				editor: "list",
				attributes: [
					{
						type: "number",
						places: 0,
						label: "sample count",
						code: "sampleCount",
						defaultValue: 100
					}, {
						type: "string",
						label: "type property",
						code: "typeProperty"
					}]
			};

			function close() {
				popup.close(dialog);
			};
			var form = new GenerateDialog({
				closeFn: close,
				ctrl: this.ctrl,
				schema: gform,
				editorFactory: createLayoutEditorFactory()
			});


			dialog.addChild(form);
			return button;
		},
		getMessages: function () {
			return messages;
		},
		execute: function () {
		}
	});
});

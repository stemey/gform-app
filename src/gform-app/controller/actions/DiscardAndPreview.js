define([
	'./PreviewButton',
	"dojo/_base/declare",
	"dojo/i18n!gform/nls/messages"
], function (PreviewButton, declare, messages) {
// module:
//		gform/controller/actions/Discard


	return declare([PreviewButton], {
		// summary:
		//		the editor's changes are removed.
		messageModule: "actions.discard",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			this.ctrl.editor.syncPendingChanges();
			this.ctrl.reset();
			//this.inherited(arguments);
		}
	});
});

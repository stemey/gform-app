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
			var me =this;
			var args=arguments;
			this.ctrl.editor.bufferChange(function() {
				me.ctrl.editor.syncPendingChanges();
				me.ctrl.reset();
				me.inherited(args);
			})
		}
	});
});

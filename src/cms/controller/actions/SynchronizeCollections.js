define([
	'dojo/request/xhr',
	'dojo/i18n!cms/nls/messages',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (xhr, messages, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		url:"http://localhost:3001/db/synchronize/",
		messageModule: "actions.synchronizeCollections",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			var entity = this.ctrl.editor.getPlainValue();
			xhr.put(this.url+entity.name,{})
		}
	});
});

define([
	'dojo/i18n!../../nls/messages',
	'dojo/topic',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (messages, topic, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		messageModule: "actions.gotodata",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			var entity = this.ctrl.editor.getPlainValue();
			topic.publish("/store/focus", {source: this, store: this.ctrl.store.getIdentity(entity)});
		}
	});
});

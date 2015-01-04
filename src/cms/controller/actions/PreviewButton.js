define([
	'dojo/i18n!cms/nls/messages',
	'dojo/topic',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (messages, topic, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		messageModule: "actions.preview",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			var errorCount = this.ctrl.editor.validate(true);
			if (errorCount == 0) {
				topic.publish("/modify/update", this._getEvent({value: this.ctrl.editor.getPlainValue()}));
			}
		},
		_getEvent: function (evt) {
			if (!evt) {
				evt = {};
			}
			var value = this.ctrl.editor.getPlainValue();
			evt.source = this;
			evt.id = this.ctrl.store.getIdentity(value);
			evt.store = this.ctrl.store.name;
			return evt;
		}
	});
});

define([
	'dojo/i18n!cms/nls/messages',
	'dojo/topic',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (messages, topic, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		messageModule: "actions.createCollection",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			var entity = this.ctrl.editor.getPlainValue();
			topic.publish("/new", {source: this,  store: "/mdbcollection",value:{db:entity.name}});
		}
	});
});

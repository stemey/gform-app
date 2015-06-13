define([
	'gform/controller/actions/_ActionMixin',
	'dojo/i18n!../../nls/messages',
	'../../util/topic',
	"dojo/_base/declare"

], function (_ActionMixin, messages,topic, declare) {
// module:
//		gform/controller/actions/Save


	return declare([_ActionMixin], {
		// summary:
		//		Saves the entity. If the entity was persistent it will be update otherwise it will be inserted.
		messageModule: "actions.duplicate",
		getMessages: function () {
			return messages;
		},
		// summary:
		//		Saves the entity. If the entity was persistent it will be update otherwise it will be inserted.
		execute: function () {
			var value = this.ctrl.editor.getPlainValue();
			var cloned = JSON.parse(JSON.stringify(value));
			delete cloned[this.ctrl.store.idProperty];
			var template = value[this.ctrl.store.typeProperty];
			topic.publish("/new",{store:this.ctrl.store.name,schemaUrl:template,value:cloned});
		}
	});
});

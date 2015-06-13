define([
	'../../util/topic',
	'gform/controller/actions/Save',
	"dojo/_base/declare"

], function (topic, Save, declare) {
// module:
//		gform/controller/actions/Save


	return declare([Save], {
		// summary:
		//		Saves the entity. If the entity was persistent it will be update otherwise it will be inserted.
		execute: function () {
			this.saveOperation = {};
			this.saveOperation.entity = this.ctrl.editor.getPlainValue();
			this.saveOperation.oldEntity = this.ctrl.editor.getOldValue();
			this.inherited(arguments);

		},
		_onUpdate: function () {
			this.inherited(arguments);
			topic.publish("/updated", {
				source: this,
				id: this.ctrl.store.getIdentity(this.saveOperation.entity),
				store: this.ctrl.store.name,
				entity: this.saveOperation.entity,
				oldEntity: this.saveOperation.oldEntity
			});
			this.saveOperation = null;
		},
		_onUpdateFailed: function () {
			this.inherited(arguments);
			this.saveOperation = null;
		}
	});
});

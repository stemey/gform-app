define([
	'../../config',
	'../../util/topic',
	'dojo/request/xhr',
	'dojo/i18n!../../nls/messages',
	"dojo/_base/declare",
	"gform/controller/actions/_ActionMixin"

], function (config, topic, xhr, messages, declare, _ActionMixin) {

	return declare([_ActionMixin], {
		path: "db-synchronize/",
		messageModule: "actions.synchronizeCollections",
		getMessages: function () {
			return messages;
		},
		execute: function () {
			var entity = this.ctrl.editor.getPlainValue();
			xhr.put(config.baseUrl + this.path + entity.name, {handleAs: "json"}).then(function (result) {
				this.ctrl.reload();
				result.collections.forEach(function (collection) {
					topic.publish("/updated", {id: collection._id, store: "/mdbcollection", entity: collection});
				})

			}.bind(this));
		}
	});
});

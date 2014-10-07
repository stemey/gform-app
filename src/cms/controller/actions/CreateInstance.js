define([
    'dojo/topic',
    'dojo/i18n!cms/nls/messages',
    'gform/controller/actions/_ActionMixin',
    "dojo/_base/declare"

], function (topic, messages, ActionMixin, declare) {
// module:
//		gform/controller/actions/Save


    return declare([ActionMixin], {
        messageModule: "actions.create-page",
        opener: null,
        createButton: function () {
            var templateStore = this.ctrl.store;
            if (templateStore.instanceStore) {
                return this.inherited(arguments);
            } else {
                return null;
            }
        },
        getMessages: function () {
            return messages;
        },
        execute: function () {
            var templateStore = this.ctrl.store;
            var entity = this.ctrl.editor.getPlainValue();
            var template = templateStore.getIdentity(entity);
            topic.publish("/new", {source: this, store: templateStore.instanceStore, schemaUrl: template});
        }
    });
});

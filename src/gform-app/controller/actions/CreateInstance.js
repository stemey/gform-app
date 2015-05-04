define([
    'dojo/aspect',
    'dojo/topic',
    'dojo/i18n!../../nls/messages',
    'gform/controller/actions/_ActionMixin',
    "dojo/_base/declare"

], function (aspect, topic, messages, ActionMixin, declare) {
// module:
//		gform/controller/actions/Save


    return declare([ActionMixin], {
        messageModule: "actions.create-page",
        opener: null,
        createButton: function () {
            var templateStore = this.ctrl.store;
            if (templateStore.instanceStore) {
                var button = this.inherited(arguments);
                var isDisabled=function() {
                    return this.ctrl.editor.getPlainValue().partial || this.ctrl.state=="create";
                }.bind(this);
                aspect.after(this.ctrl.editor, "onChange", function () {
                    button.set("disabled", isDisabled());
                });
                button.set("disabled", isDisabled());
                return button;
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

define([
    'dojo/aspect',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/_base/declare",
    "gform/controller/actions/_ActionMixin"

], function (aspect, lang, topic, declare, _ActionMixin) {

    return declare([_ActionMixin], {
        createButton: function () {
            aspect.after(this.ctrl.editor,"onChange", lang.hitch(this, "onChange"));
            aspect.before(this.ctrl, "destroy", lang.hitch(this, "onCancel"));
            return null;
        },
        onCancel: function () {
            topic.publish("/modify/cancel", this._getEvent());
        },
        onChange: function () {
            topic.publish("/modify/update", this._getEvent({value: this.ctrl.editor.getPlainValue()}));
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

define([
    '../util/FindByUrlMixin',
    'cms/util/topic',
    'dojo/_base/declare',
    'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/promise/all'
], function (FindByUrlMixin, topic, declare, Deferred, lang, all) {

    return declare([FindByUrlMixin ], {
        store: null,
        cache: null,
        constructor: function (store) {
            this.store = store;
            this.cache = {};
            topic.subscribeStore("/modify/update", lang.hitch(this, "onUpdate"), this.store.name);
            topic.subscribeStore("/modify/cancel", lang.hitch(this, "onCancel"), this.store.name);
        },
        onUpdate: function (evt) {
            this.cache[evt.id] = evt.value;
        },
        onCancel: function (evt) {
            delete this.cache[evt.id];
        },
        get: function (id) {
            var entity = this.cache[id];
            if (!entity) {
                return this.store.get(id);
            } else {
                return lang.clone(entity);
            }
        }
    });
});
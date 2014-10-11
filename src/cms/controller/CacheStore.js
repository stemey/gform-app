define([
    'dojo/promise/all',
    'dojo/_base/Deferred',
    '../util/FindByUrlMixin',
    'dojo/_base/lang',
    'cms/util/topic',
    "dojo/_base/declare"
], function (all, Deferred, FindByUrlMixin, lang, topic, declare) {

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
                var d = new Deferred();
                d.resolve(entity);
                var x =all([d,this.store.get(id)]);
                x.then(function(a,b) {
                    //console.log(a==b);
                });
                return d;
            }
        }
    });
});
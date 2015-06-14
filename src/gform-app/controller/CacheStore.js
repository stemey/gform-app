define([
    'dojo/Evented',
    '../util/FindByUrlMixin',
    '../util/topic',
    'dojo/_base/declare',
	'dojo/_base/lang'
], function (Evented, FindByUrlMixin, topic, declare, lang) {

    return declare([FindByUrlMixin,Evented ], {
        store: null,
        cache: null,
        constructor: function (store) {
            this.store = store;
            this.cache = {};
			this.typeProperty = store.typeProperty;
			this.name = store.name;
			topic.subscribeStore("/modify/update", lang.hitch(this, "onUpdate"), this.store.name);
            topic.subscribeStore("/modify/cancel", lang.hitch(this, "onCancel"), this.store.name);
        },
        onUpdate: function (evt) {
            var old = this.cache[evt.id];
            if (JSON.stringify(old)!=JSON.stringify(evt.value)) {
                this.cache[evt.id] = evt.value;
                this.emit("changed", {id:evt.id, store:evt.store})
            }
        },
        onCancel: function (evt) {
            delete this.cache[evt.id];
            this.emit("changed",{id:evt.id, store:evt.store})
        },
		query: function(query, options) {
			return this.store.query(query, options);
		},
		getIdentity: function(entity) {
			return this.store.getIdentity(entity);
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

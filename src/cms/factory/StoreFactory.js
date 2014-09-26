define([
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/aspect',
    './load',
    './ContainerFactory',
    "dojo/_base/declare"
], function (lang, topic, aspect, load, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (config) {
            var me = this;
            return load([config.storeClass], function (storeClass) {
                var store = new storeClass(config);
                aspect.around(store, "put", lang.hitch(me, "onPageUpdated", store));
                aspect.around(store, "remove", lang.hitch(me, "onPageDeleted", store));
                aspect.around(store, "add", lang.hitch(me, "onPageAdded", store));

                return store;
            });
        },
        onPageUpdated: function (store, superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                result.then(function () {
                    topic.publish("/updated", {store: store.name, id: store.getIdentity(entity), entity: entity})
                });
                return result;
            }
        },
        onPageDeleted: function (store, superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                topic.publish("/page/deleted", {store: store.name, id: store.getIdentity(entity), entity: entity})
                return result;
            }
        },
        onPageAdded: function (store, superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                topic.publish("/added", {store: store.name, id: result, entity:entity})
                return result;
            }
        }
    });


});

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
            var me =this;
            return load([config.storeClass], function (storeClass) {
                var store = new storeClass({name: config.name, target: config.target, idProperty: config.idProperty, idType: config.idType});
                aspect.around(store, "put", lang.hitch(me, "onPageUpdated"));
                aspect.around(store, "remove", lang.hitch(me, "onPageDeleted"));
                //aspect.around(store, "add", lang.hitch(me, "onPageAdded"));

                return store;
            });
        },
        onPageUpdated: function (superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                result.then(function () {
                    topic.publish("/page/updated", {entity: entity})
                });
                return result;
            }
        },
        onPageDeleted: function (superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                topic.publish("/page/deleted", {entity: entity})
                return result;
            }
        },
        onPageAdded: function (superCall) {
            var me = this;
            return function (entity) {
                var result = superCall.apply(this, arguments);
                topic.publish("/page/added", {url: entity.url})
                return result;
            }
        }
    });


});

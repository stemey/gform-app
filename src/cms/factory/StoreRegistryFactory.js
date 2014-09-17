define([
    'dojo/Deferred',
    'dojo/promise/all',
    './load',
    '../util/AtemStoreRegistry',
    "dojo/_base/declare"
], function (Deferred, all, load, AtemStoreRegistry, declare) {


    return declare([], {
        create: function (config) {
            var storeRegistry = new AtemStoreRegistry();
            var promises = [];
            config.stores.forEach(function (storeConfig) {
                var p = load([storeConfig.factoryId], function (StoreFactory) {
                    var store = new StoreFactory().create(storeConfig);
                    return store;
                })
                promises.push(p);
            }, this);
            var deferred = new Deferred();
            all(promises).then(function (s) {
                s.forEach(function (store) {
                    storeRegistry.register(store.name, store);
                })
                deferred.resolve(storeRegistry)
            });
            return deferred;
        }
    });


});

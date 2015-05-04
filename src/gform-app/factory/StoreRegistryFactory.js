define([
    './loadAll',
    '../util/AtemStoreRegistry',
    "dojo/_base/declare"
], function (loadAll, AtemStoreRegistry, declare) {


    return declare([], {
        create: function (config) {
            var storeRegistry = new AtemStoreRegistry();

            return loadAll(storeRegistry, config.stores,function(store) {
                storeRegistry.register(store.name,store);
            });

        }
    });


});

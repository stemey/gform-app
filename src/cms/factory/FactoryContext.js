define([
    'dojo/Stateful',
    "dojo/_base/declare"//
], function (Stateful, declare) {

    return declare([Stateful], {
        storeRegistry: null,
        storeId:null,
        constructor: function (config) {
            this.storeRegistry = config.storeRegistry;
        },
        getStore: function (id) {
            return this.storeRegistry.get(id);
        }
    });
});

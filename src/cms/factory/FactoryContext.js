define([
    "dojo/_base/declare"//
], function (declare) {

    return declare([], {
        storeRegistry: null,
        constructor: function (config) {
            this.storeRegistry = config.storeRegistry;
        },
        getStore: function (id) {
            return this.storeRegistry.get(id);
        }
    });
});

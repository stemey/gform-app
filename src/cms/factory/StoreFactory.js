define([
    './load',
    './ContainerFactory',
    "dojo/_base/declare"
], function (load, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (config) {
            return load([config.storeClass], function (storeClass) {
                var store = new storeClass({name: config.name, target: config.target, idProperty: config.idProperty});
                return store;
            });
        }
    });


});

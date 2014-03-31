define([
    'dojo/promise/all',
    'dojo/_base/Deferred',
    "dojo/_base/declare",
    "dojo/text!./config.json"
], function (all, Deferred, declare, config) {


    return declare([ ], {
        load: function() {
            var configuration = JSON.parse(config);
            var pageStore = this._loadStore(configuration.pageStore, "pageStore");
            var templateStore = this._loadStore(configuration.templateStore, "templateStore");
            return all([pageStore, templateStore]);
        },
        _loadStore: function(config, prop){
            var me =this;
            var deferred = new Deferred();
            require([config.type], function(Store){
                store = new Store(config.options);
                me[prop] = store;
                deferred.resolve(store);
            });
            return deferred;
        }
    })
});

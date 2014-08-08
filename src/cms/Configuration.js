define([
    'dojo/store/Observable',
    'dojo/promise/all',
    'dojo/_base/Deferred',
    "dojo/_base/declare",
    "dojo/text!./config.json"
], function (Observable, all, Deferred, declare, config) {


    return declare([ ], {
        load: function() {
            var configuration = JSON.parse(config);
            var pageStore = this._loadStore(configuration.pageStore, "pageStore");
            var templateStore = this._loadStore(configuration.templateStore, "templateStore");
            var templateConverter = this._load(configuration.templateConverter, "templateConverter");


            return all([pageStore, templateStore,templateConverter]);
        },
        _loadStore: function(config, prop){
            var me =this;
            var deferred = new Deferred();
            require([config.type], function(Store){
                // needs to be Observable and provide FindByUrl
                store = new Observable(Store(config.options));
                me[prop] = store;
                deferred.resolve(store);
            });
            return deferred;
        },
        _load: function(type, prop){
            var me =this;
            var deferred = new Deferred();
            require([type], function(obj){
                me[prop] = obj;
                deferred.resolve(obj);
            });
            return deferred;
        },
        getTemplateUrl: function() {
            return this.templateStore.target;
        }
    })
});

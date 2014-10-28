define([
    'dojo/_base/url',
    'dojo/request/xhr',
    'dojo/promise/all',
    'dojo/_base/Deferred',
    "dojo/_base/declare"
], function (url, xhr, all, Deferred, declare) {


    return declare([], {
        create: function (ctx, config) {
            var main = new Deferred;
            require([config.storeClass], function (Store) {
                xhr.get(config.apiUrl, {
                    handleAs: "json"
                }).then(function (result) {
                        var deferreds = [];
                        result.resources.forEach(function (resource) {
                            var deferred = new Deferred();
                            deferreds.push(deferred);
                            var store = new Store({name: resource.resourceUrl, template: resource.schemaUrl, idProperty: '_id', target: new url(config.apiUrl, resource.resourceUrl).uri});
                            ctx.storeRegistry.register(resource.resourceUrl, store);
                            xhr.get(new url(config.apiUrl, resource.schemaUrl).uri, {
                                handleAs: "json"
                            }).then(function (schema) {
                                    ctx.schemaRegistry.register(resource.schemaUrl, schema);
                                    deferred.resolve("done");
                                });
                        });
                        all(deferreds).then(function () {
                            main.resolve("done")
                        });
                    })
            });
            return main;
        }
    });
});

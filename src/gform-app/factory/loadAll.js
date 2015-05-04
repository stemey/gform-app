define([
    'dojo/_base/Deferred',
    './load',
    'dojo/promise/all'
], function (Deferred, load, all) {

    return function (result, configs, callback, ctx) {
        var promises = [];
        configs.forEach(function (config) {
            var p = load([config.factoryId], function (Factory) {
                if (ctx) {
                    return new Factory().create(ctx, config);
                } else {
                    return new Factory().create(config);
                }
            })
            promises.push(p);
        }, this);
        var promise = all(promises);
        var deferred = new Deferred();
        promise.then(function (s) {
            if (callback) {
                s.forEach(function (e) {
                    callback(e);
                });
            }
            deferred.resolve(result);
        });
        return deferred;
    }
});

define([
    'dojo/when',
    'dojo/_base/Deferred'
], function (when, Deferred) {

    return function (modules, callback) {
        var me = this;
        var deferred = new Deferred();
        require(modules, function () {
            var result = callback.apply(me, arguments);
            when(result).then(function (r) {
                deferred.resolve(r);
            }).otherwise(function(e) {
                    deferred.reject(e);
                });

        });
        return deferred;
    }
});

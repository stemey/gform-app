define([
    'dojo/when',
    'dojo/Deferred'
], function (when, Deferred) {
    return function(valueOrPromise, callback, errback, progback) {
        var d =new Deferred();
        var w_callback =function() {
            try {
            callback(arguments);
            d.resolve();
            } catch (e) {
                d.reject(e);
            }
        }
        var w_errback =function(e) {
            d.reject(e);
        }
        when(valueOrPromise,w_callback,w_errback,progback);
        return d;
    }
});
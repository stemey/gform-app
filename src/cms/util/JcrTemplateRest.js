define([
    './FindByUrlMixin',
    'dojo/request/handlers',
    'dojo/request/xhr',
    'dojo/store/util/QueryResults',
    'dojo/Deferred',
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (FindByUrlMixin, handlers, xhr, QueryResults, Deferred, lang, declare, JsonRest) {

    return declare([ JsonRest , FindByUrlMixin], {
        query: function (query, options) {
            var params = {};
            lang.mixin(params,query);


            if (options && options.sort) {
                var sort = [];
                options.sort.forEach(function (col) {
                    sort.push(col.attribute + (col.descending ? "-" : ""));
                });
                params.sort = sort.join("  ");

            }
            var totalCount=0;
            if (options) {
                params.skip = options.start;
                params.limit = options.count;
                totalCount=options.start;
            }

            var results = xhr.get(this.target, {query: params, handleAs: "json"});
            var totalPromise = new Deferred();
            results.then(function(res) {
                    totalPromise.resolve(res.length);
            })
           results.total = totalPromise;
            return new QueryResults(results);
        }, add: function (object, options) {
            object[this.idProperty]=object.name;
            options = options || {};

            var noHandler = function (value) {
                return value;
            }
            handlers.register("raw", noHandler);

            var promise = xhr.post(this.target, {
                data: JSON.stringify(object),
                "handleAs": "json",
                headers: lang.mixin({
                    "Content-Type": "application/json",
                    Accept: this.accepts//,
                    // "If-Match": "*",
                    //"If-None-Match": null
                }, this.headers, options.headers)
            })


            var newPromise = new Deferred();
            promise.then(lang.hitch(this, "onAdded", newPromise), newPromise.reject);
            return newPromise;
        }, onAdded: function (promise, response) {
            var id = response;
            promise.resolve(id);
        }
    });

});

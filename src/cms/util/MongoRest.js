define([
    './FindByUrlMixin',
    'dojo/request/handlers',
    'gform/util/restHelper',
    './ToMongoQueryTransform',
    'dojo/request/xhr',
    'dojo/store/util/QueryResults',
    'dojo/Deferred',
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (FindByUrlMixin, handlers, restHelper, ToMongoQueryTransform, xhr, QueryResults, Deferred, lang, declare, JsonRest) {

    return declare([ JsonRest , FindByUrlMixin], {
        transform: null,
        constructor: function () {
            this.transform = new ToMongoQueryTransform();
        },
        _getRegex: function(parentUrl) {
             return "^"+parentUrl+"\/[^\/]+$";
        },
        getChildren: function(parent, onComplete, onError) {
            query({url:{$regex:this._getRegex(parentUrl)}}).then(onComplete);
        },
        getRoot: function(onItem) {
            onItem({url:""});
        },
        getLabel: function(item) {
            return item.url;
        },
        mayHaveChildren: function(object) {
            return true;
        },
        query: function (query, options) {
            var params = {};

            var queryParams = this.transform.transform(query);
            if (queryParams) {
                params.query = JSON.stringify(queryParams);
            } else {
                lang.mixin(params, query);
            }

            if (options && options.sort) {
                var sort = [];
                options.sort.forEach(function (col) {
                    sort.push(col.attribute + (col.descending ? "-" : ""));
                });
                params.sort = sort.join("  ");

            }

            if (options) {
                params.skip = options.start;
                params.limit = options.count;
            }
            var results = xhr.get(this.target, {query: params, handleAs: "json"});
            var countParams = {count: true};
            results.total = xhr.get(this.target, {query: countParams, handleAs: "json"});
            return new QueryResults(results);
        }, add: function (object, options) {
            delete object[this.idProperty];
            options = options || {};

            var noHandler = function (value) {
                return value;
            }
            handlers.register("raw", noHandler);

            var promise = xhr.post(this.target, {
                data: JSON.stringify(object),
                "handleAs": "raw",
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
            var location = response.getHeader("Location");
            var id = restHelper.decompose(location).id;
            promise.resolve(id);
        }
    });

});

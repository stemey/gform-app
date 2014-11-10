define([
	'dojo/_base/url',
	'./FindByUrlMixin',
    'dojo/request/handlers',
	'./ToMongoQueryTransform',
    'dojo/request/xhr',
    'dojo/store/util/QueryResults',
    'dojo/Deferred',
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (url, FindByUrlMixin, handlers, ToMongoQueryTransform, xhr, QueryResults, Deferred, lang, declare, JsonRest) {

    return declare([ JsonRest , FindByUrlMixin], {
        transform: null,
        constructor: function () {
            this.transform = new ToMongoQueryTransform();
        },
        getChildren: function (parent, onComplete, onError) {
            var parentUrl = parent ? parent.url : "";
            var results = this.query({url: {$regex: this._getRegex(parentUrl)}});
            results.then(function (r) {
                var children = [];
                var files = {};
                r.forEach(function (node) {
                    var path = node.url.substring(parentUrl.length);
                    var matches = path.match(/^\/?([^\/]+)/);
                    if (matches && matches.length > 1) {
                        var name = matches[1]
                        var existingFile=files[name];
                        var exactMatch=node.url==parentUrl+matches[0];
                        var folder = !!existingFile || !exactMatch;
                        var id = exactMatch?node._id:(existingFile?existingFile.id:null);
                        files[name] = {id:id,url:matches[0],name: name, folder:folder};
                    }
                }, this);
                Object.keys(files).forEach(
                    function (key) {
                        children.push(files[key]);
                    });

                onComplete(children);
            });
        },
        getRoot: function (onItem) {
            onItem({name: "", url:"",folder:true});
        },
        getLabel: function (item) {
            return item.name;
        },
        mayHaveChildren: function (object) {
            return object.folder;
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
			var targetUrl = new url(this.target);
            var id = location.substring(targetUrl.path.length);
            promise.resolve(id);
        }
    });

});

define([
    'dojo/when',
    'dojo/store/Memory',
    '../util/AopStoreMixin',
    'dojo/promise/all',
    'dojo/request/xhr',
    './Converter',
    'dojo/_base/lang',
    'dojo/Deferred',
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (when, Memory, AopStoreMixin, all, xhr, Converter, lang, Deferred, declare, JsonRest) {


    return declare([JsonRest, Converter, AopStoreMixin], {
        constructor: function (kwArgs) {
            this.headers["Authorization"] = "token " + kwArgs.accessToken;
            this.target = "https://api.github.com/repos/" + kwArgs.owner + "/" + kwArgs.repo + "/contents/";

            this.initGithub(kwArgs);
            if (kwArgs.cacheDirectives) {
                this.cache = new Memory();
                this.loadCache();
                this.after("remove", function (result, id) {
                    if (this.isDirectory(id)) {
                        this.loadCache();
                    } else {
                        this.cache.remove(id);
                    }
                }, this);
                this.after("put", function (result, item, options) {
                    if (this.isDirectory(item.path)) {
                        this.loadCache();
                    } else {
                        if (options && options.old) {
                            this.cache.remove(options.old.path);
                        }
                        this.cache.put(item);
                    }
                }, this);
            }

        },
        initGithub: function (kwArgs) {
            this.repository = new Github({
                token: kwArgs.accessToken,
                auth: "oauth"
            }).getRepo(kwArgs.owner, kwArgs.repo);

        },
        getChildren: function (parentItem) {
            var d = new Deferred();
            var me = this;
            this.get(parentItem.path, {array: true}).then(function (items) {
                var newItems = items.map(function (item) {
                    return me.convertToItem(item);
                });
                d.resolve(newItems);
            }).otherwise(function (e) {
                d.reject(e);
            })
            return d.promise;
        },
        isDirectory: function (path) {
            // TODO incorrect for files without extension. use github's type.
            return path.indexOf(".") < 0;
        },
        _xhrGet: function(id, options) {
            throw new Error("not implemented yet");
        },
        get: function (id, options) {
            id = this.expandPath(id);
            var d = new Deferred();
            var me = this;
            this._xhrGet(id, options).then(function (item) {
                if (Array.isArray(item)) {
                    if (!options || !options.array) {
                        d.resolve({path: id, name: me.getName(id), mediaType: "folder"});
                    } else {
                        d.resolve(item);
                    }
                } else {
                    d.resolve(me.convertToItem(item));
                }

            }).otherwise(function (e) {
                d.reject(e);
            })
            return d.promise;
        },
        put: function (item, options) {
            if (options && !("overwrite" in options)) {
                options.overwrite = true;
            }
            if (options.old && item.path != options.old.path) {
                var d = new Deferred();
                this.repository.move('master', options.old.path, item.path, function (err) {
                    if (err) {
                        d.reject(err);
                    } else {
                        d.resolve("done");
                    }
                });
                return d;
            } else {

                if (!item.message) {
                    item.message = "changes by gform-app github client";
                }
                return this.inherited(arguments, [this.convertFromItem(item), options]);
            }
        },
        remove: function (id, options) {
            // summary:
            //		Deletes an object by its identity. This will trigger a DELETE request to the server.
            // id: Number
            //		The identity to use to delete the object
            // options: __HeaderOptions?
            //		HTTP headers.
            id = this.expandPath(id);
            var data = {};
            data.sha = options.old.sha;
            data.message = "delete by gform-app github client";
            data.path = id;
            options = options || {};
            if (options.old.mediaType === "folder") {
                // is a directory
                var d = new Deferred();
                this.repository.deleteDir('master', id, function (err) {
                    if (err) {
                        d.reject(err);
                    } else {
                        d.resolve("done");
                    }
                });
                return d.promise;
            } else {
                return xhr(this.target + id, {
                    method: "DELETE",
                    data: JSON.stringify(data),
                    handleAs: "json",
                    headers: lang.mixin({}, this.headers, options.headers)
                });
            }
        },
        convertToCachedItem: function (item) {
            var o = {};
            if (this.cacheDirectives.included) {
                o.path = item.path;
                this.cacheDirectives.included.forEach(function (key) {
                    o[key] = item.content[key];
                })
            } else {
                var excluded = this.cacheDirectives.excluded || [];
                Object.keys(item.content).filter(function (key) {
                    return excluded.indexOf(key) < 0
                }).forEach(function (key) {
                    o[key] = item.content[key];
                })
            }
            return o;
        },
        loadCache: function () {
            var me = this;
            var newData = [];
            this.repository.getTree("master?recursive=true", function (err, tree) {
                if (!err) {
                    tree.forEach(function (ref) {
                        if (ref.type === "blob") {
                            newData.push(me.get(ref.path));
                        }
                    })
                }
                all(newData).then(function (results) {
                    var newResults = results.map(function (e) {
                        return me.convertToCachedItem(e);
                    });
                    me.cache.setData(newResults);
                })
            });


        },
        convertToLocalQuery: function (q) {
            var newQ = {};
            Object.keys(q).forEach(function (key) {
                var val = q[key];
                var isObject = typeof val == "object";
                if (isObject && "$in" in val) {
                    newQ[key] = new RegExp(val.$in.join("|"));
                } else if (isObject && "$regex" in val) {
                    newQ[key] = new RegExp(val.$regex);
                } else {
                    newQ[key] = val;
                }
            })
            return newQ;
        },
        query: function (q, options) {
            if (this.cache) {
                var results = this.cache.query(this.convertToLocalQuery(q), options);
                results.total = when(results.length);
                return results;
            } else {
                // TODO source and path query on github

            }
        }


    });

});

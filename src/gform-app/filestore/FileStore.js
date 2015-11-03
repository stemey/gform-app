define([
    'dojo/_base/lang',
    'dojo/when',
    './AbstractTreeStore',
    'dojo/request',
    '../util/AopStoreMixin',
    'dojo/promise/all',
    'dojo/Deferred',
    "dojo/_base/declare"
], function (lang, when, AbstractTreeStore, request, AopStoreMixin, all, Deferred, declare) {


    return declare([AopStoreMixin, AbstractTreeStore], {
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            this.initCache(true);
        },
        converter:null,
        get: function (id, options) {
            if (!this.cacheDirectives) {
                return this.cache.get(id, options);
            } else {
                var d = new Deferred();
                this.load(id, options).then(function (item) {

                        d.resolve(item);
                    }.bind(this),
                    function (e) {
                        d.reject(e);
                    });
                return d;
            }
        },
        createPath: function (id, type) {
            return this.target + this.key + "/" + (type ? type + "/" : "") + this.baseDir + id;
        },
        _xhrGet: function (path, options) {
            return request.get(path, options);
        },
        load: function (id, options) {


            var path = this.createPath(id, options && options.array ? "dir" : "file");
            var d = new Deferred();
            var me = this;
            this._xhrGet(path, {handleAs: "json"}).then(function (result) {
                if (!result) {
                    return d.reject(new Error("cannot find " + path));
                }
                if (!options || !options.array) {
                        d.resolve(me.converter.toInternal({path: id, content: result.data}));
                } else {
                    d.resolve(result.data);
                }

            }).otherwise(function (e) {
                d.reject(e);
            })
            return d.promise;
        },
        convertFromItem: function (item) {
            return this.converter.toExternal(item);
        },
        add: function (object) {
            options = {};
            options.overwrite = false;
            return this.put(object, options);
        },
        put: function (item, options) {
            if (options && !("overwrite" in options)) {
                options.overwrite = true;
            }

            var postData = {data: {data:this.convertFromItem(item).content}};
            if (options.overwrite) {
                if (options.old && item.path != options.old.path) {
                    postData.data.path = this.baseDir+item.path;
                    return request.put(this.createPath(options.old.path, "rename"), postData);
                } else {
                    return request.put(this.createPath(item.path, "save"), postData);
                }
            } else {
                return request.post(this.createPath(item.path, options && options.array ? "dir" : "file"), postData);
            }
        },
        remove: function (id, options) {
            // summary:
            //		Deletes an object by its identity. This will trigger a DELETE request to the server.
            // id: Number
            //		The identity to use to delete the object
            // options: __HeaderOptions?
            //		HTTP headers.

            var path = this.createPath(id);
            var data = {};
            data.path = path;
            options = options || {};
            request.del(path);

        },
        convertToCachedItem: function(internal) {
            return this.converter.toCache(internal);
        },
        loadFileRefs: function (fileRefs, path) {
            var me = this;
            var deferred = new Deferred();
            var p = this.load(path, {array: true});
            p.then(function (children) {
                var d = [];
                Object.keys(children).forEach(function (name) {
                    var ref = children[name];
                    var relPath = ref.path.substring(me.baseDir.length + 1)
                    if (ref.type !== "directory") {
                        var p = me.load(relPath);
                        d.push(p);
                        fileRefs.push(p);
                    } else {
                        var data = {path: relPath};
                        fileRefs.push(when(me.converter.toInternal(data)));
                        d.push(me.loadFileRefs(fileRefs, relPath));
                    }
                })
                all(d).then(
                    function () {
                        deferred.resolve();
                    },
                    function (e) {
                        deferred.reject(e);
                    }
                );
            }, function (e) {
                deferred.reject(e);
            });
            return deferred.promise;
        },
        loadCache: function () {
            var deferred = new Deferred();
            var me = this;
            var fileRefs = [];
            this.loadFileRefs(fileRefs, "").then(function (files) {
                all(fileRefs).then(function (items) {
                    var newResults = items.map(function (e) {
                        return me.convertToCachedItem(e);
                    });
                    //console.log(me.name + " finished");
                    me.cache.setData(newResults);
                    deferred.resolve("done");
                }, function (e) {
                    console.error("cannot load cache", e);
                    deferred.reject(e);
                });

            }, function (e) {
                console.error("cannot load cache", e);
                deferred.reject(e);
            })
            return deferred;
        }

    });

});

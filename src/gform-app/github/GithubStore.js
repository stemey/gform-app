define([
    '../filestore/AbstractTreeStore',
    'dojo/promise/all',
    'dojo/request/xhr',
    'dojo/_base/lang',
    'dojo/Deferred',
    "dojo/_base/declare"
], function (AbstractTreeStore, all, xhr, lang, Deferred, declare) {


    return declare([AbstractTreeStore], {
        converter:null,
        headers:null,
        root:null,
        constructor: function (kwArgs) {
            lang.mixin(this,kwArgs);
            this.headers={};
            this.headers["Authorization"] = "token " + kwArgs.accessToken;
            this.target = "https://api.github.com/repos/" + kwArgs.owner + "/" + kwArgs.repo + "/contents/";

            this.initGithub(kwArgs);
        },
        expandPath: function (path) {
            if (!this.root || this.root == "") {
                return path;
            } else if (path.startsWith("/")) {
                return this.root + path;
            } else if (path === "") {
                return this.root;
            } else {
                return this.root + "/" + path;
            }
        },
        initGithub: function (kwArgs) {
            this.repository = new Github({
                token: kwArgs.accessToken,
                auth: "oauth"
            }).getRepo(kwArgs.owner, kwArgs.repo);

        },
        _xhrGet: function(id, options) {
            // TODO implement headers
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
                    d.resolve(me.converter.toInternal(item));
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
                return this.inherited(arguments, [this.converter.toExternal(item), options]);
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
           this.converter.toCache(item);
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
                        return me.converter.toCache(me.converter.toInternal());
                    });
                    me.cache.setData(newResults);
                })
            });


        }



    });

});

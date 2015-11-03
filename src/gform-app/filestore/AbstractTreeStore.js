define([
    'dojo/Deferred',
    'dojo/aspect',
    'dojo/when',
    'dojo/store/Memory',
    "dojo/_base/declare"
], function (Deferred, aspect, when, Memory, declare) {


    return declare([], {
        parentProperty:"parent",
        folderType: "folder",
        fileType: "file",
        jsonContent: false,
        loadCache: function () {

        },
        getSuffix: function (path) {
            var suffix = "";
            var parts = path.split(".")
            if (parts.length > 1) {
                suffix = parts[parts.length - 1];
            }
            return suffix;
        },
        getName: function (path) {
            var parts = path.match(/\/([^\/\.]+)(\.[^.]+)?$/);
            return parts[1];
        },
        getParentPath: function (path) {
            var index = path.lastIndexOf("/");
            return path.substring(0, index);
        },
        isDirectory: function (path) {
            // TODO incorrect for files without extension. use github's type.
            return path.indexOf(".") < 0;
        },
        getIdentity: function (item) {
            return item ? item[this.idProperty] : null;
        },
        initCache: function () {
            this.cache = new Memory({idProperty: this.idProperty});
            this.loadCache();
            this.after("remove", function (result, id) {
                if (this.isDirectory(id)) {
                    this.loadCache();
                } else {
                    this.cache.remove(id);
                }
            }, this);
            var me = this;
            aspect.around(this, "put", function (superCall) {
                return function (item, options) {
                    var deferred = new Deferred();
                    var result = superCall.apply(me, arguments);
                    when(result).then(function () {
                        item[me.parentProperty] = me.getParentPath(item.path);
                        // TODO need to call convert to item: name and stuff
                        if (me.isDirectory(item.path)) {
                            me.loadCache().then(function () {
                                deferred.resolve(item);
                            }, function (e) {
                                deferred.reject(e);
                            })
                        } else {
                            if (options && options.old) {
                                me.cache.remove(options.old.path);
                            }
                            me.cache.put(item);
                            // TODO we need to add missing parents
                            deferred.resolve(item);
                        }
                    }, function (e) {
                        deferred.reject(e);
                    })
                    return deferred;
                }
            });


        },
        convertToLocalQuery: function (q) {
            var newQ = {};
            Object.keys(q).forEach(function (key) {
                var val = q[key];
                var isObject = val && typeof val === "object";
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
        getChildren: function (parentItem) {
            return when(this.query({parent: parentItem.path},{sort:[{attribute:"index"},{attribute:"name"}]}));
        },
        query: function (q, options) {
            if (this.cache) {
                var results = this.cache.query(this.convertToLocalQuery(q), options);
                results.total = when(results.length);
                return results;
            } else {
                // TODO source and path query on github

            }
        },
        getType: function(item) {
            if(!item.content) {
                return this.folderType
            }else
            if (this.jsonContent) {
                return item.content[this.typeProperty];
            } else {
                var mappings = mappings[this.getSuffix(item.path)]
                return mappings.mediaType;

            }
        }


    });

});

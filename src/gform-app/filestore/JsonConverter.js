define([
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {



    return declare([], {
        folderType:null,
        typeProperty:null,
        pathProperty:"path",
        constructor: function(kwArgs) {
           lang.mixin(this, kwArgs)
        },
        getName: function (path) {
            var parts = path.match(/\/([^\/\.]+)(\.[^.]+)?$/);
            return parts[1];
        },
        getParentPath: function (path) {
            var index = path.lastIndexOf("/");
            return path.substring(0, index);
        },
        toInternal: function (external) {
            if (external.content) {
                var internal = JSON.parse(external.content);
                internal.parent = this.getParentPath(external.path);
                internal[this.pathProperty]=external.path;
            } else {
                var internal = {};
                internal.name=this.getName(external.path);
                internal.parent = this.getParentPath(external.path);
                internal[this.typeProperty] = this.folderType;
                internal[this.pathProperty]=external.path;
            }
            return internal;
        },
        toCache: function (internal) {
            var cache = {};
            lang.mixin(cache, internal);
            return cache;
        },
        toExternal: function (internal) {
            var external = {};
            // TODO what if type is set (templates and partials) but there are folders. how do we model that?
            if (this.typeProperty && internal[this.typeProperty]==this.folderType) {
                throw new new Error("cannot convert folder to external");
            } else {
                var data ={};
                lang.mixin(data, internal);
                delete data[this.pathProperty];
                delete data.parent;
                var external={};
                external.path=internal[this.pathProperty];
                external.content=JSON.stringify(data);
            }
            return external;
        }
    });

});

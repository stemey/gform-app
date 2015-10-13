define([
    'dojo/_base/lang',
    "dojo/_base/declare",
    "dojo/text!../cms/schema/types.json",// TODO reference to cms is a cross package ref
], function (lang, declare,types) {


    var mappings={};
    JSON.parse(types).types.forEach(function(e) {
        mappings[e.ext]={mediaType: e.type,mode: e.ace};
    })

    return declare([], {
        folderType: null,
        typeProperty: null,
        contentMode: "contentMode",
        pathProperty: "path",
        defaultMapping:{mediaType: "binary"},
        mappings: mappings,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs)
        },
        getName: function (path) {
            var parts = path.match(/\/([^\/\.]+)(\.[^.]+)?$/);
            return parts[1];
        },
        getExtension: function (path) {
            var ext = "";
            var parts = path.split(".")
            if (parts.length > 1) {
                ext = parts[parts.length - 1];
            }
            return ext;
        },
        getParentPath: function (path) {
            var index = path.lastIndexOf("/");
            return path.substring(0, index);
        },
        toInternal: function (external) {
            var internal = {};
            internal[this.pathProperty] = external.path;
            internal.name = this.getName(external.path);
            internal.parent = this.getParentPath(external.path);
            if (external.content) {
                internal.content = external.content;
                var extension = this.getExtension(external.path);
                var mapping = this.mappings[extension];
                if (!mapping) {
                    mapping = this.defaultMapping;
                }
                internal[this.typeProperty] = mapping.mediaType;
                if (mapping.mode) {
                    internal[this.contentMode] = mapping.mode;
                }

            } else {
                internal[this.typeProperty] = this.folderType;
            }
            return internal;
        },
        toCache: function (internal) {
            var cache = {};
            lang.mixin(cache, internal);
            //delete cache.content;
            return cache;
        },
        toExternal: function (internal) {
            var external = {};
            if (internal[this.typeProperty] == this.folderType) {
                external.path=internal.path;
            } else {
                external.content = internal.content;
                external.path = internal[this.pathProperty];
            }
            return external;
        }
    });

});

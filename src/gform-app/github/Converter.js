define([
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {

    return declare([], {
        encoded: true,
        mappings: {
            default: {mediaType: "binary"},
            js: {mode: "ace/mode/javascript", mediaType: "text"},
            html: {mode: "ace/mode/html", mediaType: "text"},
            css: {mode: "ace/mode/css", mediaType: "text"},
            jsx: {mode: "ace/mode/jsx", mediaType: "text"},
            json: {mode: "ace/mode/json", mediaType: "text"},
            png: {mediaType: "binary"}
        },
        getName: function (path) {
            return path.substring(path.lastIndexOf("/") + 1);
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
        convertFromItem: function (item) {
            var newItem = {};
            newItem.message=item.message;
            if (item.sha) {
                newItem.sha = item.sha;
            }

            newItem.path = this.expandPath(item.path);
            if (!newItem.name) {
                newItem.name = this.getName(newItem.path);
            }
            if (!newItem.type) {
                var suffix = this.getSuffix(item.path);
                if (!suffix) {
                    newItem.type = "dir";
                } else {
                    newItem.type = "file";
                }
            }
            if (item.content) {
                newItem.content = this.encoded ? btoa(item.content) : item.content;
            }
            return newItem;
        },
        getSuffix: function (path) {
            var suffix = "";
            var parts = path.split(".")
            if (parts.length > 1) {
                suffix = parts[parts.length - 1];
            }
            return suffix;
        },
        toInternal: function (result) {
            var newItem = {};
            lang.mixin(newItem, result);
            delete newItem.content;
            if (result.type === "dir") {
                newItem[this.typeProperty] = this.folderType;
            } else {
                delete newItem.content;
                if (result.content) {

                    newItem.content = this.encoded ? atob(result.content) : result.content;
                }
                var suffix = this.getSuffix(result.path);
                var mapping = this.mappings[suffix] || this.mappings["default"];
                newItem.contentMode = mapping.mode;
                newItem.mediaType = mapping.mediaType;
                newItem.suffix = suffix;


            }
            if (!!this.root && this.root!="" && newItem.path.startsWith(this.root)) {
                newItem.path = newItem.path.substring((this.root).length);
                if (newItem.path.startsWith("/")) {
                    newItem.path = newItem.path.substring(1);
                }
            }
            if (!newItem.name) {
                newItem.name = this.getName(newItem.path);
            }
            return newItem;
        },
        constructor: function (kwArgs) {

            lang.mixin(this, kwArgs);
        }
    });

});

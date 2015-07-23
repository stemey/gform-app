define([
    'dojo/_base/lang',
    'dojox/encoding/base64',
    'dojo/Deferred',
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (lang, base64, Deferred, declare, JsonRest) {

    return declare([JsonRest], {
        mappings: {
            default: "",
            js: "ace/mode/javascript",
            html: "ace/mode/html",
            css: "ace/mode/css",
            jsx: "ace/mode/jsx"
        },
        atos: function (arr) {
            for (var i = 0, l = arr.length, s = '', c; c = arr[i++];)
                s += String.fromCharCode(
                    c > 0xdf && c < 0xf0 && i < l - 1
                        ? (c & 0xf) << 12 | (arr[i++] & 0x3f) << 6 | arr[i++] & 0x3f
                        : c > 0x7f && i < l
                        ? (c & 0x1f) << 6 | arr[i++] & 0x3f
                        : c
                );

            return s
        },
        bin2String: function (bytes) {
            var i, str = '';

            for (i = 0; i < bytes.length; i++) {
                str += '%' + ('0' + bytes[i].toString(16)).slice(-2);
            }
            str = decodeURIComponent(str);
            return str;
        },
        c:function(s) {
                return atob(s);
        },
        convertToItem: function (result) {
            if (!result.content) {
                return result;
            } else {
                var newItem = {};
                lang.mixin(newItem, result);
                delete newItem.content;
                newItem.content = this.c(result.content);
                var parts = result.name.split(".")
                var suffix = "default";
                if (parts.length > 1) {
                    suffix = parts[parts.length - 1];
                }
                newItem.contentMode = this.mappings[suffix]
                return newItem;
            }
        },
        constructor: function (kwArgs) {
            this.headers["Authorization"] = "token " + kwArgs.accessToken;
            //this.headers.Accept="application/vnd.github-blob.raw";
            this.target = "https://api.github.com/repos/" + kwArgs.owner + "/" + kwArgs.repo + "/contents/";
        },
        getChildren: function (parentItem) {
            var d = new Deferred();
            var me = this;
            this.get(parentItem.path).then(function (items) {
                var newItems = items.map(function (item) {
                    return me.convertToItem(item);
                });
                d.resolve(newItems);
            }).otherwise(function (e) {
                d.reject(e);
            })
            return d.promise;
        },
        get: function (id) {
            var d = new Deferred();
            var me = this;
            this.inherited(arguments).then(function (item) {
                d.resolve(me.convertToItem(item));
            }).otherwise(function (e) {
                d.reject(e);
            })
            return d.promise;
        }
    });

});

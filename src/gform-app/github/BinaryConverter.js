define([
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {

    return declare([], {
        format: function (item) {
            var binary = {};
            lang.mixin(binary, item);
            binary.type = item.suffix;
        },
        parse: function (binary) {
            var item = {};
            lang.mixin(item, binary);
            binary.type = "file"
        }
    });

});

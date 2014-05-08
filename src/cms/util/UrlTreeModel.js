define([
    'dojo/when',
    "dojo/_base/lang",
    "dojo/_base/declare"
], function (when, lang, declare) {

    return declare(null, {
        store: null,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },
        _getRegex: function (parentUrl) {
            return "^" + parentUrl + "\/?[^\/]+";
        },
        getChildren: function (parent, onComplete, onError) {
            var parentUrl = parent ? parent.url : "";
            var results = this.store.query({url: {$regex: this._getRegex(parentUrl)}});
            when(results).then(function (r) {
                var children = [];
                var files = {};
                r.forEach(function (node) {
                    var path = node.url.substring(parentUrl.length);
                    var matches = path.match(/^\/?([^\/]+)/);
                    if (matches && matches.length > 1) {
                        var name = matches[1]
                        var existingFile = files[name];
                        var exactMatch = node.url == parentUrl + matches[0];
                        var folder = !!existingFile || !exactMatch;
                        var id = exactMatch ? node._id : (existingFile ? existingFile.id : null);
                        files[name] = {id: id, url: matches[0], name: name, folder: folder};
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
            if (onItem) {
                onItem({name: "", url: "", folder: true});
            }
        },
        getLabel: function (item) {
            return item.name;
        },
        mayHaveChildren: function (object) {
            return object.folder;
        },
        getIdentity: function(object) {
            return this.store.getIdentity(object);
        }
    });

});

define([
    './Converter',
    "dojo/_base/declare"
], function (Converter, declare) {

    return declare([Converter], {
        data: null,
        constructor: function () {
            this.data = [];
        },
        getChildren: function (parentItem) {
            var parentPath = this.expandPath(parentItem.path);
            var filtered = this.data.filter(function (item) {
                var matches = new RegExp("^" + parentPath + "\\/([^\\/ ]*)$").exec(item.path);
                return matches && matches.length > 1 && item.path!==parentPath;
            })
            if (!filtered) {
                return filtered;
            } else {
                return filtered.map(this.convertToItem, this);
            }
        },
        get: function (path) {
            path=this.expandPath(path);
            var filtered= this.data.filter(function (item) {
                return item.path == path;
            });
            if (filtered.length>0) {
                return this.convertToItem(filtered[0]);
            } else{
                return null;
            }
        },
        getIdentity: function (item) {
            return item[this.idProperty];
        },
        put: function(item,options) {
            if (options.old && options.old[this.idProperty]!=item[this.idProperty]) {
                this.remove(options.old[this.idProperty]);
            }
            this._remove(this.expandPath(item.path));
            this.add(item);
        },
        add: function (item) {
            this.data.push(this.convertFromItem(item));
        },
        query: function () {
            return this.data;
        },
        remove: function(path) {
          return this._remove(path);
        },
        _remove: function (path) {
            path=this.expandPath(path);
            this.data.forEach(function (item, idx) {
                if (item.path == path) {
                    delete this.data[idx]
                }
            }, this);
            return true;
        }
    });

});

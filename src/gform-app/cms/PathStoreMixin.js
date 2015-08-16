define([
    'dojo/when',
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (when, lang, declare) {

    return declare([], {
        initialized:false,
        initializing:false,
        _getPath: function (item) {
            if (item.parent) {
                return this.get(item.parent).path + "/" + encodeURIComponent(item.name);
            } else {
                // TODO always assume root to be "/"?
                return "";
            }
        },
        query: function() {
            if(!this.initialized) {
                this.initialize();
            }
            return this.inherited(arguments);
        },
        _convert: function (item) {
            var newItem = lang.clone(item);
            newItem.path = this._getPath(item);
            return newItem;
        },
        get: function () {
            return this._convert(this.inherited(arguments));
        },
        initialize: function() {
            this.initialized=true;
            var me =this;
            when(this.query({})).then(function(results) {
                me.initializing=true;
                results.forEach(function(item) {
                    me.put(me._convert(item));
                });
                me.initializing=false;
            })
        },
        put: function(item,options) {
            this.inherited(arguments);
            if(!this.initializing) {
                this.initialize();
            }
        }
    });

});

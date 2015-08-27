define([
    'dstore/db/LocalStorage',
    "dojo/_base/declare"

], function (LocalStorage, declare) {


    return declare([LocalStorage], {
        version: null,
        constructor: function (kwArgs) {
            if (kwArgs) {
                this.version = kwArgs.version
            }
            var versionKey = this.storeName+"_c4a_store_version";
            var version = localStorage.getItem(versionKey);
            if (this.version && version !== this.version) {
                this.setData([]);
                localStorage.setItem(versionKey,this.version);
            }
        }
    });
});

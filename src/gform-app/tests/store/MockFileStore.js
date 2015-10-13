define([
    'dojo/when',
    '../../filestore/FileStore',
    "dojo/_base/declare"
], function (when, FileStore, declare) {

    return declare([FileStore], {
        mockData:null,
        loadCache: function() {
           if (this.mockData) {
               this.inherited(arguments);
           }
        },
        _xhrGet: function(id, options) {
            return when(this.mockData[id]);
        }
    });


});

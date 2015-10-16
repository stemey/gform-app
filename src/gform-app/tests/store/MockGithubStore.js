define([
    '../../github/GithubStore',
    'dojo/when',
    "dojo/_base/declare"
], function (GithubStore, when, declare) {

    return declare([GithubStore], {
        mockData:null,
        encoded:false,
        loadCache: function() {
            var tree = Object.keys(this.mockData).map(function(k) {
                return this.mockData[k];
            }, this)
            this.repository ={
                getTree: function() {
                    return tree;
                }
            }

            this.inherited(arguments);
        },
        initGithub: function() {
        },
        _xhrGet: function(id, options) {
            return when(this.mockData[id]);
        }
    });


});

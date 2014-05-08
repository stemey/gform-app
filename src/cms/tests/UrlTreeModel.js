define([
    'dojo/_base/declare',
    '../util/UrlTreeModel',
    'intern!bdd',
    'intern/chai!assert'
], function (declare, UrlTreeModel, bdd, assert) {


    var Store = declare([],{
        children:null,
        constructor: function(children){
            this.children=children;
        },
        query: function(query, options) {
            var pattern = query.url.$regex;

            return this.children.filter(function(e) {
                return new RegExp(pattern).test(e.url);
            })
        }
    });

    bdd.describe('UrlTreeModel', function () {
        var renderer;

        bdd.before(function () {

        });

        bdd.after(function () {

        });

        bdd.it('getChildren should return one child ', function () {
            var store = new Store([{url:"/products",_id:1}]);
            var model = new UrlTreeModel({store:store});
            var root = model.getRoot();
            model.getChildren(root, function(children) {
                assert.equal(children[0].name, "products");
            });

        });

        bdd.it('missing leading slash ', function () {
            var store = new Store([{url:"products",_id:1}]);
            var model = new UrlTreeModel({store:store});
            var root = model.getRoot();
            model.getChildren(root, function(children) {
                assert.equal(children[0].name, "products");
            });

        });


    });
});
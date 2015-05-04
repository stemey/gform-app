3define([
	'intern!bdd',
    'intern/chai!assert'
], function (bdd, assert) {
    bdd.describe('mongo rest', function () {
        var renderer;

        bdd.before(function () {

        });

        bdd.after(function () {

        });

        bdd.it('mongo rest"', function () {
            var mongoRest = {
                query: function(query, options) {
                    assert.equal(query.url.$regex, "");
                    return [{url:"/products",_id:1}]
                }
            }
            var root = mongoRest.getRoot();
            var children = mongoRest.getChildren(root);
            assert.equal(children[0].name, "products");

        });


    });
});

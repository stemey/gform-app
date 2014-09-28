define([
    'cms/util/TreeStore',
    'intern!bdd',
    'intern/chai!assert'
], function (TreeStore, bdd, assert) {
    bdd.describe('treestore', function () {
        var store;

        bdd.before(function () {
            store= new TreeStore();
        });

        bdd.after(function () {

        });

        bdd.it('getParents("/uuu") should return [""]', function () {
            var parents = store.getParents("/uuu");
            assert.equal(parents.length,1);
            assert.equal(parents[0],"");

        });

        bdd.it('getParents("/uuu/zzz") should return ["","/uuu"]', function () {
            var parents = store.getParents("/uuu/zzzz");
            assert.equal(parents.length,2);
            assert.equal(parents[0],"");
            assert.equal(parents[1],"/uuu");

        });

        bdd.it('getUnloadedParents() 1', function () {
            store.childrenCache={"/pages":{}}
            var parents = store.getUnloadedParents([""]);
            assert.equal(parents.length,1);
            assert.equal("/pages",parents[0]);
        });
        
        bdd.it('getUnloadedParents() 2', function () {
            store.childrenCache={"/pages":{}}
            var parents = store.getUnloadedParents(["","/uuuu"]);
            assert.equal(parents.length,2);
            assert.equal("/pages",parents[0]);
            assert.equal("/pages/uuuu",parents[1]);
        });

        bdd.it('getUnloadedParents() 4', function () {
            store.childrenCache={"/pages":{},"/pages/uu":{}}
            var parents = store.getUnloadedParents(["","/uu","/uu/zz"]);
            assert.equal(parents.length,2);
            assert.equal("/pages/uu/zz",parents[1]);
            assert.equal("/pages/uu",parents[0]);
        });

    });
});
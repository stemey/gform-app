define([
    '../../filestore/FileConverter',
    './MockGithubStore',
    'dojo/_base/Deferred',
    'intern!bdd',
    'intern/chai!assert'
], function (FileConverter, MockGithubStore, Deferred, bdd, assert) {


    bdd.describe('GithubStore', function () {
        var store;

        bdd.beforeEach(function () {
            store = new MockGithubStore({
                converter: new FileConverter({
                    folderType: "__folder",
                    typeProperty: "__type"
                }),
                idProperty: "path",
                typeProperty: "__type"
            });


        });

        var mockData = {
            "/page.html": {
                type: "file",
                content: "content",
                path: "/page.html"
            },
            "/sub": [
                {
                    type: "file",
                    content: "content",
                    path: "/sub/x.html"
                }
            ]
        }


        var assertPromise = function (p, cb) {
            var d = new Deferred();
            p.then(function (item) {
                try {
                    cb(item);
                    d.resolve();
                } catch (e) {
                    d.reject(e);
                }
            }, d.reject);
            return d;
        }


        bdd.it('single file', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.get("/page.html");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/page.html");
                assert.equal(item.content, "content");
                assert.equal(item.__type, "text");
                assert.equal(item.name, "page.html");
            });

        });

        bdd.it('get directory as node', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.get("/sub");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/sub");
                assert.equal(item.__type, "__folder");
                assert.equal(item.name, "sub");
            });

        });

        bdd.it('get children', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.getChildren({path: "/sub"});
            return assertPromise(p, function (items) {
                assert.equal(items[0].path, "/sub/x.html");
                assert.equal(items[0].__type, "text");
                assert.equal(items[0].name, "x.html");
            });

        });


    });
});

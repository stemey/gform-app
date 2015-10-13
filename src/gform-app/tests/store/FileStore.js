define([
    '../../filestore/FileConverter',
    '../../filestore/JsonConverter',
    'dojo/_base/Deferred',
    './MockFileStore',
    'intern!bdd',
    'intern/chai!assert'
], function (FileConverter, JsonConverter, Deferred, MockFileStore, bdd, assert) {


    bdd.describe('FileStore', function () {
        var store;

        bdd.beforeEach(function () {
            store = new MockFileStore({
                idProperty: "path",
                target: "target/",
                "key": "1234",
                "baseDir": "data",
                typeProperty: "fileType",
                converter: new FileConverter({folderType: "folder", pathProperty: "path", typeProperty: "fileType"})
            });

            jsonStore = new MockFileStore({
                jsonContent: true,
                idProperty: "path",
                target: "target/",
                "key": "1234",
                "baseDir": "data",
                typeProperty: "template",
                converter: new JsonConverter({folderType: "folder", pathProperty: "path", typeProperty: "template"})
            });

        });

        var mockData = {
            "target/1234/file/data/page.html": {success: true, data: "content"},
            "target/1234/dir/data": {
                success: true,
                data: {
                    "page.html": {type: "file", path: "/file/page.html"},
                    "sub": {type: "directory", path: "/file/sub"}
                }
            },

            "target/1234/dir/data/sub": {
                success: true,
                data: {"x.html": {type: "file", path: "/file/sub/x.html"}}
            }
            ,
            "target/1234/file/data/sub/x.html": {
                success: true,
                data: "more content"
            }
        }


        var mockJsonData = {
            "target/1234/file/data/page.json": {success: true, data: JSON.stringify({template: "page", text: "Hallo"})},
            "target/1234/dir/data": {
                success: true,
                data: {
                    "page.json": {type: "file", path: "/file/page.json"},
                    "sub": {type: "directory", path: "/file/sub"}
                }
            },

            "target/1234/dir/data/sub": {
                success: true,
                data: {"x.json": {type: "file", path: "/file/sub/x.json"}}
            }
            ,
            "target/1234/file/data/sub/x.json": {
                success: true,
                data: JSON.stringify({template: "page", text: "bye"})
            }
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
                assert.equal(item.fileType, "text");
            });

        });

        bdd.it('single json file', function () {
            jsonStore.mockData = mockJsonData;
            jsonStore.loadCache();

            var p = jsonStore.get("/page.json");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/page.json");
                assert.equal(item.template, "page");
                assert.equal(item.text, "Hallo");
            });

        });

        bdd.it('single file in deeper dir', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.get("/sub/x.html");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/sub/x.html");
                assert.equal(item.content, "more content");
                assert.equal(item.fileType, "text");
            });

        });


        bdd.it('get directory', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.get("/sub");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/sub");
                assert.equal(item.fileType, "folder");
            });

        });

        bdd.it('get json directory', function () {
            jsonStore.mockData = mockJsonData;
            jsonStore.loadCache();

            var p = jsonStore.get("/sub");
            return assertPromise(p, function (item) {
                assert.equal(item.path, "/sub");
                assert.equal(item.template, "folder");
            });

        });

        bdd.it('getChildren', function () {
            store.mockData = mockData;
            store.loadCache();

            var p = store.getChildren({path: "/sub"});
            p.then(function (items) {
                assert.equal(items.length, 1);
                assert.equal(items[0].path, "/sub/x.html");
            });
            return p;

        });


    });
});

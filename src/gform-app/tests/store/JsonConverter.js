define([
    'gform-app/filestore/JsonConverter',
    'intern!bdd',
    'intern/chai!assert'
], function (JsonConverter, bdd, assert) {


    bdd.describe('FileStore', function () {
        var converter = new JsonConverter({typeProperty: "type", pathProperty: "pathx", folderType: "folderx"});

        bdd.beforeEach(function () {


        });


        bdd.it('toInternal', function () {
            var internal = converter.toInternal({path: "/tt/kk.json", content:'{"x": "hallo"}'});

            assert.equal(internal.pathx, "/tt/kk.json");
            assert.equal(internal.x, "hallo");
            assert.equal(internal.parent, "/tt");

        });

        bdd.it('toCache', function () {
            var cached = converter.toCache({pathx: "/tt/kk.json", parent:"/tt", x: "hallo"});
            assert.equal(cached.pathx, "/tt/kk.json");
            assert.equal(cached.x, "hallo");
            assert.equal(cached.parent, "/tt");
        });

        bdd.it('toExternal', function () {
            var external = converter.toExternal({pathx: "/tt/kk.json", parent:"/tt", x: "hallo"});

            assert.equal(external.content, '{"x":"hallo"}');
            assert.equal(external.path, "/tt/kk.json");
            assert.equal(Object.keys(external).length, 2);


        });





    });
});

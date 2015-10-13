define([
    'gform-app/filestore/FileConverter',
    'intern!bdd',
    'intern/chai!assert'
], function (FileConverter, bdd, assert) {


    bdd.describe('FileStore', function () {
        var converter = new FileConverter({pathProperty:"pathx",typeProperty: "type",  folderType: "folderx"});

        bdd.beforeEach(function () {


        });


        bdd.it('toInternal', function () {
            var internal = converter.toInternal({path: "/tt/kk.json", content:'moin'});

            assert.equal(internal.pathx, "/tt/kk.json");
            assert.equal(internal.content, "moin");
            assert.equal(internal.parent, "/tt");
            assert.equal(internal.contentMode, "ace/mode/json");

        });

        bdd.it('toCache', function () {
            var cached = converter.toCache({pathx: "/tt/kk.json", parent:"/tt", content: "hallo"});
            assert.equal(cached.pathx, "/tt/kk.json");
            assert.equal(cached.parent, "/tt");
            assert.equal(cached.content, "hallo");
            assert.equal(Object.keys(cached).length, 3);
        });

        bdd.it('toExternal', function () {
            var external = converter.toExternal({pathx: "/tt/kk.json", parent:"/tt", content: "hallo"});

            assert.equal(external.content, 'hallo');
            assert.equal(external.path, "/tt/kk.json");
            assert.equal(Object.keys(external).length, 2);


        });





    });
});

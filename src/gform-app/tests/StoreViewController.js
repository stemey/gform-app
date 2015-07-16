define([
    'gform/controller/StoreRegistry',
    '../SchemaRegistry',
    '../factory/AppContext',
    '../factory/StoreViewController',
    'intern!bdd',
    'intern/chai!assert'
], function (StoreRegistry, SchemaRegistry, AppContext, StoreViewController, bdd, assert) {
    bdd.describe('store view controller', function () {
        var ctx;
        var createEditorFactory = function () {
            return {}
        };

        var gridFactory = {
            create: function () {
                return null;
            }
        };
        var mockCreator = {
            create: function (creator) {

            }
        };


        var metaStore = {
            getIdentity: function (e) {
                return e.id;
            }
        }


        bdd.beforeEach(function () {

            ctx = new AppContext({storeRegistry: new StoreRegistry()});
            ctx.schemaRegistry = new SchemaRegistry();


        });

        bdd.after(function () {

        });

        bdd.it('add ', function () {
            var schema = {group: {attributes: [{code: "name", type: "string"}]}};
            ctx.addSchema("schema", schema);
            ctx.addStore("test", {template: "schema"});

            var stc = new StoreViewController({
                ctx: ctx,
                groupProperty: "menuGroup",
                metaStore: metaStore,
                factory: gridFactory,
                creator: mockCreator

            })

            stc.addStore({id: "test", name: "testName", menuGroup: "stores", schema: {schema: {}}});


            assert.equal(ctx.views[0].id, "test");
            assert.equal(ctx.views[0].label, "testName");
            assert.equal(ctx.views[0].group, "stores");

            var store = ctx.getStore("test");
            assert.equal(store.template, "schema");


        });

        bdd.it('add multi ', function () {
            var schema1 = {id: 1, name: "schema1", group: {attributes: [{code: "name", type: "string"}]}};
            var schema2 = {id: 2, name: "schema2", group: {attributes: [{code: "text", type: "string"}]}};
            var schemas = [schema1, schema2];
            ctx.addSchema("schema1", schema1);
            ctx.addSchema("schema2", schema2);
            ctx.addStore("test", {templateStore: "schemaStore"});
            ctx.addStore("schemaStore", {
                idProperty: "id",
                query: function () {
                    return schemas;
                }
            });

            var stc = new StoreViewController({
                ctx: ctx,
                groupProperty: "menuGroup",
                metaStore: metaStore,
                factory: gridFactory,
                creator: mockCreator

            })

            stc.addStore({
                id: "test",
                name: "testName",
                menuGroup: "stores",
                schema: {schemas: ["schema1", "schema2"]}
            });


            assert.equal(ctx.views[0].id, "test");
            assert.equal(ctx.views[0].label, "testName");
            assert.equal(ctx.views[0].group, "stores");

            stc.removeStore("test");

            assert.equal(ctx.views.length, 0);


        });

        bdd.it('remove ', function () {
            var schema = {group: {attributes: [{code: "name", type: "string"}]}};
            ctx.addSchema("schema", schema);
            ctx.addStore("test", {template: "schema"});

            var stc = new StoreViewController({
                ctx: ctx,
                groupProperty: "menuGroup",
                metaStore: metaStore,
                factory: gridFactory,
                creator: mockCreator

            })

            stc.addStore({id: "test", name: "testName", menuGroup: "stores", schema: {schema: {}}});
            stc.removeStore("test");


            assert.equal(ctx.views.length, 0);


        });




    });
});

define([
    '../cms/MultiTemplateRefArrayResolver',
    'intern!bdd',
    'intern/chai!assert'
], function (MultiTemplateRefArrayResolver, bdd, assert) {


    bdd.describe('MultiTemplateRefArrayResolver', function () {
        var resolver;

        bdd.beforeEach(function () {
            resolver = new MultiTemplateRefArrayResolver({templateStore:"/template"});

        });


        bdd.it('test ', function () {
            var mytemplate={
                id:"my",
                group: {attributes: [1]}
            };
            var yourtemplate={
                id:"your",
                group: {attributes: [2]}
            };

            var schema = {
                type:"array",
                element:{
                    editor:"multi-template-ref",
                    templates: ["mytemplate","yourtemplate"]
                }


            }
            var ref = resolver.resolve(schema);

            assert.equal(ref.length,2);
            assert.equal(ref[0].store,"/template");
            assert.equal(ref[0].id,"mytemplate");

            ref[0].setter(mytemplate);
            ref[1].setter(yourtemplate);

            assert.ok(schema.groups);
            assert.equal(schema.templates.length,2);
            assert.equal(schema.groups.length,2);
            assert.equal(schema.groups[0], mytemplate.group);
            assert.equal(schema.groups[0].code, "my");
            assert.equal(schema.typeProperty,"__type__");
            assert.equal(schema.type,"array");
            assert.notOk(schema.editor);

        });




    });
});

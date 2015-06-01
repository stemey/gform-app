define([
    '../cms/MultiTemplateRefResolver',
    'intern!bdd',
    'intern/chai!assert'
], function (MultiTemplateRefResolver, bdd, assert) {


    bdd.describe('MultiTemplateRefResolver', function () {
        var resolver;

        bdd.beforeEach(function () {
            resolver = new MultiTemplateRefResolver();

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
                editor:"multi-template-ref",
                templates: ["mytemplate","yourtemplate"]
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
            assert.equal(schema.type,"object");
            assert.notOk(schema.editor);

        });




    });
});

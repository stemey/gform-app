define([
    '../cms/TemplateRefResolver',
    'intern!bdd',
    'intern/chai!assert'
], function (TemplateRefResolver, bdd, assert) {


    bdd.describe('TemplateRefResolver', function () {
        var resolver;

        bdd.beforeEach(function () {
            resolver = new TemplateRefResolver();

        });


        bdd.it('test ', function () {
            var template={
                group: {attributes: []}
            };

            var schema = {
                editor:"template-ref",
                template: "mytemplate"
            }
            var ref = resolver.resolve(schema);

            assert.equal(ref.store,"/template");
            assert.equal(ref.id,"mytemplate");

            ref.setter(template);

            assert.ok(schema.template);
            assert.equal(schema.group,schema.template.group);
            assert.equal("object",schema.type);
            assert.notOk(schema.editor);

        });




    });
});

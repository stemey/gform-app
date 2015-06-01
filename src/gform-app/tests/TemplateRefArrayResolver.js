define([
    '../cms/TemplateRefArrayResolver',
    'intern!bdd',
    'intern/chai!assert'
], function (TemplateRefArrayResolver, bdd, assert) {


    bdd.describe('TemplateRefArrayResolver', function () {
        var resolver;

        bdd.beforeEach(function () {
            resolver = new TemplateRefArrayResolver();

        });


        bdd.it('test ', function () {
            var template = {
                group: {editor: "xx", attributes: []}
            };

            var schema = {
                type: "array",
                element: {
                    editor: "template-ref",
                    "template": "mytemplate"
                }
            }
            var ref = resolver.resolve(schema);

            assert.equal(ref.store, "/template");
            assert.equal(ref.id, "mytemplate");

            ref.setter(template);

            assert.ok(schema.template);
            assert.equal(schema.group, schema.template.group);
            assert.equal(schema.group.type, "object");
            assert.equal(schema.type, "array");
            assert.equal(schema.group.editor, "xx");
            assert.notOk(schema.editor);

        });


    });
});

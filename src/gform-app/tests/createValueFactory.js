define([
    'gform-app/cms/createValueFactory',
    'intern!bdd',
    'intern/chai!assert'
], function (createValueFactory, bdd, assert) {
    bdd.describe('treestore', function () {
        var templateStore;
        var instanceStore;

        bdd.before(function () {
            templateStore = {name: "template", idType: "string"};
            instanceStore = {changeableId:true, name: "page", typeProperty:"template",idProperty: "path", idType: "string", parentProperty: "parent"};
        });

        bdd.after(function () {

        });

        bdd.it('test id is path', function () {
            var template = createValueFactory.createTemplate(templateStore, instanceStore);
            assert.equal(template.group.attributes[0].code, "name");
            assert.equal(template.group.attributes[1].code, "template");
            assert.equal(template.group.attributes[2].code, "parent");
            assert.equal(template.group.attributes[2].disabled, true);
            assert.equal(template.group.attributes[3].code, "index");
            assert.equal(template.group.attributes[4].code, "path");
            assert.equal(template.group.attributes[4].disabled, false);
            assert.equal(template.group.attributes.length, 5);

        });

        bdd.it('test id is not path', function () {

            instanceStore.idProperty = "id";
            var template = createValueFactory.createTemplate(templateStore, instanceStore);
            assert.equal(template.group.attributes[0].code, "name");
            assert.equal(template.group.attributes[1].code, "template");
            assert.equal(template.group.attributes[2].code, "parent");
            assert.equal(template.group.attributes[2].disabled, false);
            assert.equal(template.group.attributes[3].code, "path");
            assert.equal(template.group.attributes[3].disabled, true);
            assert.equal(template.group.attributes[4].code, "index");
            assert.equal(template.group.attributes[5].code, "id");
            assert.equal(template.group.attributes[5].disabled, false);
            assert.equal(template.group.attributes.length, 6);

        });


    });
});

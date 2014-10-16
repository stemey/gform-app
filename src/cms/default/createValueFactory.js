define([
], function () {

    return function (templateStore, instanceStore, partial) {

        var typeAttribute = {};
        typeAttribute.code = instanceStore.typeProperty;
        typeAttribute.schemaUrl = templateStore.template;
        typeAttribute.url = templateStore.name;
        typeAttribute.idProperty = templateStore.idProperty;
        typeAttribute.searchProperty = "name";//TODO make configurable
        typeAttribute.editor = "ref";
        typeAttribute.converter = "templateConverter";
        typeAttribute.disabled = true;

        var attributes = [];
        if (partial !== true) {
            attributes.push({code: "url", "editor": "string", type: "string", required: true});
        }
        attributes.push({code: instanceStore.idProperty, "editor": "string", type: instanceStore.idType, required: false, disabled: true});
        attributes.push(typeAttribute);

        var group = {editor: "listpane", attributes: attributes};
        var template = {};
        template.group = group;
        template.partial = partial === true;

        return template;
    }
});

define([
], function () {

    return function (templateStore, instanceStore, partial) {

        // this is the template sore
        var typeAttribute={};
        typeAttribute.code=instanceStore.typeProperty;
        typeAttribute.type="string";
        typeAttribute.editor="string";
        typeAttribute.visible=false;


        var parentAttribute={};
        parentAttribute.code=instanceStore.parentProperty;
        parentAttribute.typeProperty=instanceStore.typeProperty;
        parentAttribute.schemas=["folder"];
        parentAttribute.url=instanceStore.name;
        parentAttribute.idProperty=store.idProperty;
        parentAttribute.searchProperty="name";
        parentAttribute.type="multi-ref";
        parentAttribute.editor="multi-ref";


        var attributes = [];
        attributes.push(typeAttribute);
        if (!partial) {
            attributes.push({
                code: instanceStore.idProperty,
                "editor": "string",
                type: instanceStore.idType,
                required: false,
                disabled: true
            });
            attributes.push(parentAttribute);
        }

        var group = {editor: "listpane", attributes: attributes};
        var template = {};
        template.partial = partial === true;
        template.group = group;


        return template;
    }
});

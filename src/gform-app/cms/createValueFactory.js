define([
], function () {

    return function (templateStore, instanceStore, partial) {

        // this is the template sore
        var typeAttribute={};
        typeAttribute.code=instanceStore.typeProperty;
        typeAttribute.type=templateStore.idType || "string";
        typeAttribute.editor="string";
        typeAttribute.visible=false;

        var nameAttribute={};
        nameAttribute.code="name";
        nameAttribute.type="string";
        nameAttribute.editor="string";
        nameAttribute.visible=false;


        var parentAttribute={};
        parentAttribute.code=instanceStore.parentProperty;
        parentAttribute.typeProperty=instanceStore.typeProperty;
        parentAttribute.schemas=["folder"];
        parentAttribute.url=instanceStore.name;
        parentAttribute.idProperty=instanceStore.idProperty;
        parentAttribute.searchProperty="name";
        parentAttribute.type="multi-ref";
        parentAttribute.editor="multi-ref";
        parentAttribute.required=true;


        var attributes = [];
        attributes.push(nameAttribute);
        attributes.push(typeAttribute);
        if (!partial) {
            attributes.push({
                code: instanceStore.idProperty,
                "editor": instanceStore.idType || "string",
                type: instanceStore.idType || "string",
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

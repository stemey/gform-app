define([], function () {

    return function (schema, ctx) {
        var store = ctx.getStore(this.instanceStore);
        // this is the template sore
        var typeAttribute={};
        typeAttribute.code=store.typeProperty;
        typeAttribute.type="string";
        typeAttribute.editor="string";
        typeAttribute.visible=false;


        var parentAttribute={};
        parentAttribute.code=store.parentProperty;
        parentAttribute.typeProperty=store.typeProperty;
        parentAttribute.schemas=["folder"];
        parentAttribute.url=store.name;
        parentAttribute.idProperty=store.idProperty;
        parentAttribute.searchProperty="name";
        parentAttribute.type="multi-ref";
        parentAttribute.editor="multi-ref";


        var attributes = [];
        attributes.push({code: store.idProperty, "editor": "string", type: store.idType, required: false, disabled: true});
        attributes.push(typeAttribute);
        attributes.push(parentAttribute);

        var group = {editor: "listpane", attributes: attributes};
        var template = {};
        template.group = group;

        return template;
    }
});

define([
], function () {

    return function (schema, ctx) {
        var store = ctx.getStore(this.instanceStore);

        var typeAttribute={};
        typeAttribute.code=store.typeProperty;
        typeAttribute.schemaUrl=this.template;
        typeAttribute.url=this.name;
        typeAttribute.idProperty=this.idProperty;
        typeAttribute.searchProperty="name";
        typeAttribute.editor="ref";
        typeAttribute.converter="templateConverter";
        typeAttribute.disabled=true;

        var attributes = [];
        attributes.push({code: "url", "editor": "string", type: "string", required: true});
        attributes.push({code: store.idProperty, "editor": "string", type: store.idType, required: false, disabled: true});
        attributes.push(typeAttribute);

        var group = {editor: "listpane", attributes: attributes};
        var template = {};
        template.group = group;

        return template;
    }
});

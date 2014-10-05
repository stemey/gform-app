define([
], function () {

    return function (schema, ctx) {
        var store= ctx.getStore(this.instanceStore);
        var attributes = [];
        attributes.push({code: "url", "editor": "string", type: "string", required: true});
        attributes.push({code: store.idProperty, "editor": "string", type: store.idType, required: false, disabled: true});
        attributes.push({code: store.typeProperty, "editor": "string", type: "string", required: false, disabled:true});

        var group = {editor: "listpane", attributes: attributes};

        var template = {};
        template.group = group;

        return template;
    }
});

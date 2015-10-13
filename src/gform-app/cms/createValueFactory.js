define([], function () {

    return {
        _createTemplate: function () {
            var attributes = [];
            var group = {editor: "listpane", attributes: attributes};
            var template = {};
            template.group = group;
            return template;
        },
        _createNameAttribute: function () {
            var nameAttribute = {};
            nameAttribute.code = "name";
            nameAttribute.type = "string";
            nameAttribute.editor = "string";
            return nameAttribute;
        },
        createPartial: function (templateStore) {
            var template = this._createTemplate();
            //template.group.attributes.push(this._createNameAttribute());
            return template;

        },
        createTemplate: function (templateStore, instanceStore) {
            var template = this._createTemplate();
            var attributes = template.group.attributes;


            var pathIsId=instanceStore.idProperty=="path";

            attributes.push(this._createNameAttribute());

            var typeAttribute = {};
            typeAttribute.code = instanceStore.typeProperty;
            typeAttribute.type = templateStore.idType || "string";
            typeAttribute.editor = "string";
            typeAttribute.visible = false;
            attributes.push(typeAttribute);

            var parentAttribute = {};
            parentAttribute.code = instanceStore.parentProperty;
            parentAttribute.typeProperty = instanceStore.typeProperty;
            parentAttribute.url = instanceStore.name;
            parentAttribute.idProperty = instanceStore.idProperty;
            parentAttribute.searchProperty = "name";
            parentAttribute.type = "multi-ref";
            parentAttribute.editor = "multi-page-ref";
            parentAttribute.query={template:{$regex:".*[fF]older.*"}}
            parentAttribute.required = !pathIsId;
            parentAttribute.disabled=pathIsId;
            attributes.push(parentAttribute);

            if (!pathIsId) {
                var pathAttribute = {};
                pathAttribute.code = "path";
                pathAttribute.type = "string";
                pathAttribute.editor = "multi-page-ref";
                pathAttribute.disabled = true
                attributes.push(pathAttribute);
            }

            var indexAttribute = {};
            indexAttribute.code = "index";
            indexAttribute.type = "number";
            indexAttribute.editor = "number";
            indexAttribute.min=1
            indexAttribute.format="#";
            attributes.push(indexAttribute);


            attributes.push({
                code: instanceStore.idProperty,
                "editor": instanceStore.idType || "string",
                type: instanceStore.idType || "string",
                required: false,
                disabled: false
            });

            return template;
        }


    }


});

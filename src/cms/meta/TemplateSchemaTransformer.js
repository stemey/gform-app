define([
    'dojo/_base/declare'
], function (declare) {
// module:
//		gform/util/Resolver


    return declare("cms.TemplateSchemaTransfomer", [], {
        idType:null,
        idProperty:null,
        constructor: function(templateStore) {
            this.idProperty = templateStore.idProperty;
            this.idType = templateStore.idType;
        },
        transform: function (schema) {
            if (schema.schema == "template") {
                var form = schema.group;
                this._transformTemplate(form);
                form[this.idProperty] = schema[this.idProperty];
                return form;
            } else {
                return schema;
            }
        },
        _transformTemplate: function (schema) {
            var attributes = this._findAttributes(schema);
            var idAttribute = {};
            idAttribute.code=this.idProperty;
            idAttribute.type=this.idType;
            idAttribute.editor=this.idType;
            idAttribute.visible=false;
            attributes.push(idAttribute);
            attributes.push({code:"template", type:"string", "editor":"string", visible:false});
            return schema;

        },
        _findAttributes: function(schema) {
            if (schema.attributes) {
                return schema.attributes;
            } if (schema.group && schema.group.attributes) {
                return this._findAttributes(schema.group);
            } else if (schema.groups) {
                return this._findAttributes(schema.groups[0]);
            }
        }

    })
});


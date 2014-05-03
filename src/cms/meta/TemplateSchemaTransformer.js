define([
    'dojo/when',
    'dojo/Deferred',
    'gform/util/Resolver',
    'dojo/_base/declare'
], function (when, Deferred, Resolver, declare) {
// module:
//		gform/util/Resolver


    return declare("cms.TemplateSchemaTransfomer", [], {
        idType: null,
        idProperty: null,
        constructor: function (templateStore) {
            this.idProperty = templateStore.idProperty;
            this.idType = templateStore.idType;
        },
        transform: function (schema, skipResolve) {
            var d = new Deferred();
            var resolver = new Resolver();
            resolver.idProperty = this.idProperty;
            var p;
            if (!skipResolve) {
                p = resolver.resolve(schema);
            } else {
                p=schema;
            }
            var me = this;
            when(p).then(function () {
                if (schema.schema == "template") {
                    var form = schema.group;
                    me._transformTemplate(form);
                    form[me.idProperty] = schema[me.idProperty];
                    d.resolve(form);
                } else {
                    d.resolve(schema);
                }
            }).otherwise(function (e) {
                    d.reject(e)
                });
            return d;
        },
        _transformTemplate: function (schema) {
            var attributes = this._findAttributes(schema);
            var idAttribute = {};
            idAttribute.code = this.idProperty;
            idAttribute.type = this.idType;
            idAttribute.editor = this.idType;
            idAttribute.disabled = true;
            attributes.push(idAttribute);
            attributes.push({code: "template", type: "string", "editor": "string", visible: false});
            return schema;

        },
        _findAttributes: function (schema) {
            if (schema.attributes) {
                return schema.attributes;
            }
            if (schema.group && schema.group.attributes) {
                return this._findAttributes(schema.group);
            } else if (schema.groups) {
                return this._findAttributes(schema.groups[0]);
            }
        }

    })
});

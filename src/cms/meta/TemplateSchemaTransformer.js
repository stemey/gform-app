define([
    'dojo/when',
    'dojo/Deferred',
    './Resolver',
    'dojo/_base/declare'
], function (when, Deferred, Resolver, declare) {
// module:
//		gform/util/Resolver


    return declare("cms.TemplateSchemaTransfomer", [], {
        idType: null,
        idProperty: null,
        baseUrl:null,
        constructor: function (store) {
            this.idProperty = store.idProperty;
            this.idType = store.idType;
            this.baseUrl=store.target;
        },
        transform: function (schema, skipResolve) {
            var d = new Deferred();
            var resolver = new Resolver();
            resolver.idProperty = this.idProperty;
            resolver.baseUrl=this.baseUrl;
            var p;
            if (!skipResolve) {
                p = resolver.resolve(schema, this.baseUrl);
            } else {
                p=schema;
            }
            var me = this;
            when(p).then(function () {
				// TODO remove dependency on schema property and group property
                d.resolve(schema.group);

            }).otherwise(function (e) {
                    d.reject(e)
                });
            return d;
        },
        _transformTemplate: function (schema) {
            var attributes = this._findAttributes(schema);
            //var idAttribute = {};
            //idAttribute.code = this.idProperty;
            //idAttribute.type = this.idType;
            //idAttribute.editor = this.idType;
            //idAttribute.disabled = true;
            //attributes.push(idAttribute);
            // TODO make this configurable
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


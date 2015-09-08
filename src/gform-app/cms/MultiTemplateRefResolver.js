define("gform-app/cms/MultiTemplateRefResolver", [
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {

    // TOD this attribute is not properly handled by meta.isComplexType etc.
    return declare([], {
        constructor: function(kwArgs) {
            lang.mixin(this,kwArgs);
        },
        resolve: function (obj) {
            if (obj && obj.editor && obj.editor === "multi-template-ref" && obj.templates) {
                //var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;

                var refs = [];
                //delete obj.editor;
                //obj.type="object";
                obj.groups = [];
                obj.templates.forEach(function (template, idx) {
                    var idProperty = this.templateStore.idProperty;
                    var cb = function (value) {
                        value.group.code = value[idProperty];
                        obj.groups.push(value.group);
                        obj.templates.push(value);
                        //value.group.template=value;
                        //obj.type = "object";
                        //delete obj.editor;
                    }
                    refs.push({store: this.templateStore.name, id: template, setter: cb});
                },this)
                obj.templates=[];
                obj.typeProperty="__type__";
                delete obj.editor;
                obj.type="object";
                // TODO template store needs to be configured
                return refs;
            } else {
                return false;
            }
        }
    });
});

define([
    "dojo/_base/declare"
], function (declare) {

    // TOD this attribute is not properly handled by meta.isComplexType etc.
    return declare([], {
        resolve: function (obj) {
            if (obj && obj.editor && obj.editor === "multi-template-ref" && obj.templates) {
                //var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;

                var refs = [];
                //delete obj.editor;
                //obj.type="object";
                obj.groups = [];
                obj.templates.forEach(function (template, idx) {
                    var cb = function (value) {
                        value.group.code = value.id;
                        obj.groups.push(value.group);
                        obj.typeProperty="__type";
                        obj.templates.push(value);
                        //value.group.template=value;
                        //obj.type = "object";
                        //delete obj.editor;
                    }
                    refs.push({store: "/template", id: template, setter: cb});
                })
                obj.templates=[];
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

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
                obj.templates.forEach(function (template) {
                    var cb = function (value) {
                        value.group.code = value.id;
                        obj.templates.push(value);
                        //obj.type = "object";
                        //delete obj.editor;
                    }
                    refs.push({store: "/template", id: template, setter: cb});
                })
                obj.templates = [];
                // TODO template store needs to be configured
                return refs;
            } else {
                return false;
            }
        }
    });
});

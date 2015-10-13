define([
    '../../gform/primitive/binary/MimeTypeHelper',
    'gform/createFullEditorFactory',
    "dojo/text!./schema/types.json"
], function (MimeTypeHelper, createFullEditorFactory, types) {


    return function () {
        var ef = createFullEditorFactory();
        var mappings={};
        JSON.parse(types).types.map(function(e) {
            mappings[e.ext]= e.mimetype;
        });
        ef.mimeTypeHelper = new MimeTypeHelper(mappings)
        //ef.addConverterForType(BinaryConverter, "binary");
        return ef;
    }

});

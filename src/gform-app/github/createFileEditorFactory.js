define([
    'gform/controller/actions/Close',
    'gform/controller/actions/Discard',
    'gform/controller/actions/Delete',
    'gform/controller/actions/Save',
    'gform/controller/actions/ActionFactory',
    'gform/primitive/binary/MimeTypeHelper',
    './BinaryConverter',
    'gform/createFullEditorFactory',
    "dojo/text!../file/types.json"
], function (Close, Discard, Delete, Save, ActionFactory, MimeTypeHelper, BinaryConverter, createFullEditorFactory, types) {


    return function () {
        var ef = createFullEditorFactory();
        var mappings={};
        JSON.parse(types).types.map(function(e) {
            mappings[e.ext]= e.mimetype;
        });
        ef.mimeTypeHelper = new MimeTypeHelper(mappings)
        ef.addConverterForType(BinaryConverter, "binary");

        var actionFactory = new ActionFactory();
        actionFactory.add({type: Save,props:{handleResult:"reload"}});
        actionFactory.add({type: Delete});
        actionFactory.add({type: Discard});
        actionFactory.add({type: Close});

        ef.actionFactory=actionFactory;


        return ef;
    }

});

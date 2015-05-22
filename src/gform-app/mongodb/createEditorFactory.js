define([
	'./ejsonDateConverter',
	'../controller/actions/Preview',
	'../controller/actions/CreateInstance',
    '../controller/actions/Save',
    'gform/controller/actions/Close',
    'gform/controller/actions/Discard',
    'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
	'gform/primitive/nullablePrimitiveConverter',
	'gform/createFullEditorFactory'
], function (ejsonDateConverter, Preview, CreateInstance, Save, Close, Discard, Delete, ActionFactory, converter, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");

        binaryAf = ef.getAttributeFactory({type:"binary"});
		if (binaryAf && config) {
			binaryAf.fileServerUrl = config["fileserver-upload"];//http://localhost:4444/upload";
			binaryAf.baseUrl = config["fileserver-download"];//="http://localhost:4444/";
		}

		ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
		ef.addConverterForType(ejsonDateConverter, "date");


        var af = new ActionFactory();
        af.add({type:Save})
        af.add({type:Discard})
        af.add({type:Delete})
        af.add({type:Close});
        af.add({type:CreateInstance});
        af.add({type:Preview});

        ef.actionFactory=af;


        return ef;
    }

});

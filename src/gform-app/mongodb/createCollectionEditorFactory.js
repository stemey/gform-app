define([
	'../dynamicstore/createMetadataEditorFactory',
	'../controller/actions/GenerateSchema',
	'../controller/actions/GoToData',
	'../controller/actions/DiscardAndPreview',
	'../controller/actions/Save',
    'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory'
], function (createMetadataEditorFactory, GenerateSchema, GoToData, DiscardAndPreview, Save, Close, Delete, ActionFactory) {


    return function (config) {
        var ef = createMetadataEditorFactory(config);


        var af = new ActionFactory();
        af.add({type:Save})
		af.add({type:DiscardAndPreview})
		af.add({type:GenerateSchema});
		af.add({type:GoToData});
		af.add({type:Delete})
		af.add({type:Close});

        ef.actionFactory=af;


        return ef;
    }

});

define([
	'../dynamicstore/createSchemaEditorFactory',
	'../controller/actions/DiscardAndPreview',
	'../controller/actions/PreviewButton',
	'../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory'
], function (createSchemaEditorFactory, DiscardAndPreview, PreviewButton,  Save, Close, Delete, ActionFactory) {


	return function (config) {
		var ef = createSchemaEditorFactory();

		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: DiscardAndPreview})
		af.add({type: Delete})
		af.add({type: Close});
		af.add({type: PreviewButton});

		ef.actionFactory = af;


		return ef;
	}

});

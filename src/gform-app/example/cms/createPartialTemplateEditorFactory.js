define([
	'./createTemplateEditorFactory',
	'../../controller/actions/Preview',
	'../../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Discard',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory'
], function (createTemplateEditorFactory, Preview, Save, Close, Discard, Delete, ActionFactory) {


	return function () {
		var ef = createTemplateEditorFactory();

		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: Discard})
		af.add({type: Delete})
		af.add({type: Close});
		af.add({type: Preview});

		ef.actionFactory = af;


		return ef;
	}

});

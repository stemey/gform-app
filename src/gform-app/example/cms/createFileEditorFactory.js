define([
    '../../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Discard',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory',
    'gform/createFullEditorFactory'
], function (Save, Close, Discard, Delete, ActionFactory, createFullEditorFactory) {


	return function () {
		var ef = createFullEditorFactory();


		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: Discard})
		af.add({type: Delete})
		af.add({type: Close});

		ef.actionFactory = af;


		return ef;
	}

});

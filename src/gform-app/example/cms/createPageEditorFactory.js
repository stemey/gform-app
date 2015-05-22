define([
	'../../controller/actions/DiscardAndPreview',
	'../../controller/actions/PreviewButton',
	'../../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory',
	'gform/primitive/nullablePrimitiveConverter',
	'gform/createFullEditorFactory'
], function (DiscardAndPreview, PreviewButton,  Save, Close, Delete, ActionFactory, converter, createFullEditorFactory) {


	return function (config) {
		var ef = createFullEditorFactory();

		ef.addConverterForType(converter, "ref");
		ef.addConverterForType(converter, "multi-ref");

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

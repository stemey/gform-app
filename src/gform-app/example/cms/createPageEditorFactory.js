define([
	'../../controller/actions/Duplicate',
	'../../controller/actions/DiscardAndPreview',
	'../../controller/actions/Preview',
	'../../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory',
	'gform/primitive/nullablePrimitiveConverter',
	'gform/createFullEditorFactory'
], function (Duplicate, DiscardAndPreview, Preview,  Save, Close, Delete, ActionFactory, converter, createFullEditorFactory) {


	return function (config) {
		var ef = createFullEditorFactory();

		var attributeFactoryFinder = ef.get("attributeFactoryFinder");


		ef.addConverterForType(converter, "ref");
		ef.addConverterForType(converter, "multi-ref");

		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: DiscardAndPreview})
		af.add({type: Delete})
		af.add({type: Close});
		af.add({type: Preview});
		af.add({type: Duplicate});

		ef.actionFactory = af;


		return ef;
	}

});

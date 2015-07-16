define([
	'../controller/actions/DiscardAndPreview',
	'../controller/actions/PreviewButton',
	'../util/urlConverter',
	'./SchemaAttributeFactory',
	'../util/identityConverter',
	'../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory',
	'gform/special/formbuilder/FormValidator',
	'gform/special/formbuilder/AttributeRefFactory',
	'gform/special/formbuilder/FormAttributeFactory',
	'gform/special/formbuilder/RepeatedFormAttributeFactory',
	'gform/primitive/nullablePrimitiveConverter',
	'./RequiredAttributes',
	'gform/createFullEditorFactory'
], function (DiscardAndPreview, PreviewButton,  urlConverter, SchemaAttributeFactory, identityConverter, Save, Close, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, RepeatedFormAttributeFactory,  converter, RequiredAttributes, createFullEditorFactory) {


	return function (config) {
		var ef = createFullEditorFactory();
		var attributeFactoryFinder = ef.get("attributeFactoryFinder");
		attributeFactoryFinder.addAttributeFactory(new SchemaAttributeFactory({editorFactory: ef}));
		ef.addCtrValidator("requiredAttributes", RequiredAttributes);

		ef.addConverterForType(converter, "ref");
		ef.addConverterForType(converter, "multi-ref");

		ef.addConverterForid(identityConverter, "templateConverter");
		ef.addConverterForid(urlConverter, "urlConverter");


		ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
		ef.addAttributeFactory(new RepeatedFormAttributeFactory({editorFactory: ef}));
		ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
		ef.addCtrValidator("form", FormValidator);

		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: DiscardAndPreview})
		af.add({type: Delete})
		af.add({type: Close});
		//af.add({type: PreviewButton});

		ef.actionFactory = af;


		return ef;
	}

});

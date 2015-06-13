define([
	'../../controller/actions/Duplicate',
	'../../controller/actions/Preview',
	'../../util/identityConverter',
	'../../controller/actions/CreateInstance',
	'../../controller/actions/Save',
	'gform/controller/actions/Close',
	'gform/controller/actions/Discard',
	'gform/controller/actions/Delete',
	'gform/controller/actions/ActionFactory',
	'gform/special/formbuilder/FormValidator',
	'gform/special/formbuilder/AttributeRefFactory',
	'gform/special/formbuilder/FormAttributeFactory',
	'gform/special/formbuilder/RepeatedFormAttributeFactory',
	'gform/primitive/refConverter',
	'gform/primitive/nullablePrimitiveConverter',
	'../../dynamicstore/RequiredAttributes',
	'./TemplateAttributes',
	'gform/createFullEditorFactory'
], function (Duplicate, Preview, identityConverter, CreateInstance, Save, Close, Discard, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, RepeatedFormAttributeFactory, refConverter, converter, RequiredAttributes, TemplateAttributes, createFullEditorFactory) {


	return function () {
		var ef = createFullEditorFactory();
		var attributeFactoryFinder = ef.get("attributeFactoryFinder");
		ef.addCtrValidator("requiredAttributes", RequiredAttributes);
		ef.addValidator("templateAttributes", TemplateAttributes);

		ef.addConverterForType(converter, "ref");
		ef.addConverterForType(converter, "multi-ref");
		ef.addConverterForid(refConverter, "refConverter");
		ef.addConverterForid(identityConverter, "identityConverter");

		ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
		ef.addAttributeFactory(new RepeatedFormAttributeFactory({editorFactory: ef}));
		ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
		ef.addCtrValidator("form", FormValidator);

		var af = new ActionFactory();
		af.add({type: Save})
		af.add({type: Discard})
		af.add({type: Delete})
		af.add({type: Close});
		af.add({type: CreateInstance});
		af.add({type: Preview});
		af.add({type: Duplicate});

		ef.actionFactory = af;


		return ef;
	}

});

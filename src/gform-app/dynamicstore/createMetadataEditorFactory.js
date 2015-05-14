define([
	'./SchemaPlainValueFactory',
	'../controller/actions/GenerateSchema',
	'../controller/actions/GoToData',
	'../controller/actions/DiscardAndPreview',
	'./SchemaPlainValueFactory',
	'../util/urlConverter',
	'./SchemaAttributeFactory',
	'../util/stringTemplateConverter',
	'../controller/actions/Save',
    'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
    'gform/special/formbuilder/FormValidator',
    'gform/special/formbuilder/AttributeRefFactory',
    'gform/special/formbuilder/FormAttributeFactory',
    'gform/primitive/nullablePrimitiveConverter',
    '../meta/TemplateRefAttributeFactory',
    '../RequiredAttributes',
	'gform/createFullEditorFactory'
], function (SchemaPlainValueFactory, GenerateSchema, GoToData, DiscardAndPreview, PlainValueFactory, urlConverter, SchemaAttributeFactory, stringTemplateConverter, Save, Close, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory,  converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");


        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");

		ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
        ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
        ef.addCtrValidator("form",FormValidator);
		ef.addCtrValidator("requiredAttributes", RequiredAttributes);

		var pvf = new SchemaPlainValueFactory({
			idProperty: config.idProperty,
			idType: config.idType
		});

		ef.putFunction("/dynamicstore/multi-schema/create", pvf.createMultiSchema.bind(pvf));
		ef.putFunction("/dynamicstore/single-schema/create", pvf.createSingleSchema.bind(pvf));

        var af = new ActionFactory();
        af.add({type:Save})
		af.add({type:DiscardAndPreview})
		af.add({type:GoToData});
		af.add({type:Delete})
		af.add({type:Close});

        ef.actionFactory=af;


        return ef;
    }

});

define([
	'./ejsonDateConverter',
	'./MultiEntityRefAttributeFactory',
	'./SchemaRefAttributeFactory',
	'../controller/actions/Preview',
	'../controller/actions/CreateInstance',
    '../controller/actions/Save',
    'gform/controller/actions/Close',
    'gform/controller/actions/Discard',
    'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
    'gform/special/formbuilder/FormValidator',
    'gform/special/formbuilder/AttributeRefFactory',
    'gform/special/formbuilder/FormAttributeFactory',
	'gform/primitive/nullablePrimitiveConverter',
    '../meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
	'gform/createFullEditorFactory'
], function (ejsonDateConverter, MultiEntityRefAttributeFactory, SchemaRefAttributeFactory, Preview, CreateInstance, Save, Close, Discard, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
		attributeFactoryFinder.addAttributeFactory(new MultiEntityRefAttributeFactory({editorFactory: ef}));
		ef.addCtrValidator("requiredAttributes", RequiredAttributes);

        ef.getAttributeFactory({type:"binary"}).fileServerUrl=config["fileserver-upload"];//http://localhost:4444/upload";
        ef.getAttributeFactory({type:"binary"}).baseUrl=config["fileserver-download"];//="http://localhost:4444/";

		attributeFactoryFinder.addAttributeFactory(new SchemaRefAttributeFactory({editorFactory: ef}));
		ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
		ef.addConverterForType(ejsonDateConverter, "date");
        //ef.addConverterForid(stringTemplateConverter, "templateConverter");

        ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
        ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
        ef.addCtrValidator("form",FormValidator);

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

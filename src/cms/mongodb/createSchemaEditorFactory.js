define([
	'../util/stringTemplateConverter',
	'../controller/actions/Save',
    'gform/controller/actions/Close',
    'gform/controller/actions/Discard',
    'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
    'gform/special/formbuilder/FormValidator',
    'gform/special/formbuilder/AttributeRefFactory',
    'gform/special/formbuilder/FormAttributeFactory',
    './refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    '../meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
	'gform/createFullEditorFactory'
], function (stringTemplateConverter, Save, Close, Discard, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
        ef.addCtrValidator("requiredAttributes", RequiredAttributes);

        ef.getAttributeFactory({type:"binary"}).fileServerUrl=config["fileserver-upload"];//http://localhost:4444/upload";
        ef.getAttributeFactory({type:"binary"}).baseUrl=config["fileserver-download"];//="http://localhost:4444/";

        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
        ef.addConverterForid(refConverter, "refConverter");
        ef.addConverterForid(stringTemplateConverter, "templateConverter");

        ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
        ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
        ef.addCtrValidator("form",FormValidator);

        var af = new ActionFactory();
        af.add({type:Save})
        af.add({type:Discard})
        af.add({type:Delete})
        af.add({type:Close});

        ef.actionFactory=af;


        return ef;
    }

});
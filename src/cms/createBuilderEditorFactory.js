define([
    './controller/actions/Save',
    'gform/controller/actions/Close',
    'gform/controller/actions/Discard',
    'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
    'gform/special/formbuilder/FormValidator',
    'gform/special/formbuilder/AttributeRefFactory',
    'gform/special/formbuilder/FormAttributeFactory',
    'gform/primitive/refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    './meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
    'gform/createFullEditorFactory'
], function (Save, Close, Discard, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


    return function () {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
        ef.addValidator("requiredAttributes", RequiredAttributes);
        //ef.addConverterForid(urlConverter,"urlConverter");
        // TODO file server url needs to be configurable
        ef.getAttributeFactory({type:"binary"}).fileServerUrl="http://localhost:4444/upload";
        ef.getAttributeFactory({type:"binary"}).baseUrl="http://localhost:4444/";

        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
        ef.addConverterForid(refConverter, "refConverter");

        ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
        ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
        ef.addCtrValidator("form",FormValidator);

        var af = new ActionFactory();
        af.add({type:Save})
        af.add({type:Discard})
        af.add({type:Delete})
        af.add({type:Close})

        ef.actionFactory=af;


        return ef;
    }

});

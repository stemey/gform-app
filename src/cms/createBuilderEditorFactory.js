define([
    'gform/special/formbuilder/FormValidator',
    'gform/special/formbuilder/AttributeRefFactory',
    'gform/special/formbuilder/FormAttributeFactory',
    'gform/primitive/refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    './meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
    'gform/createFullEditorFactory'
], function (FormValidator, AttributeRefFactory, FormAttributeFactory, refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


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


        return ef;
    }

});

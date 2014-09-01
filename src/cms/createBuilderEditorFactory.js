define([
    'gform/primitive/refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    './meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
    'gform/createFullEditorFactory'
], function (refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


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

        return ef;
    }

});

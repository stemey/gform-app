define([
    'gform/primitive/refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    './meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
    './meta/CmsGroupFactory',
    'gform/createFullEditorFactory'
], function (refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, CmsGroupFactory, createFullEditorFactory) {


    return function () {
        var ef = createFullEditorFactory();
        ef.addGroupFactory("cmsgroup", new CmsGroupFactory({editorFactory: ef}));
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
        ef.addValidator("requiredAttributes", RequiredAttributes);
        //ef.addConverterForid(urlConverter,"urlConverter");
        ef.getAttributeFactory({type:"binary"}).fileServerUrl="http://localhost:4444/upload";
        ef.getAttributeFactory({type:"binary"}).baseUrl="http://localhost:4444/";

        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
        ef.addConverterForid(refConverter, "refConverter");

        return ef;
    }

});

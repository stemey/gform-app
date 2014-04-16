define([
    './util/urlConverter',
    './meta/TemplateRefAttributeFactory',
    'cms/RequiredAttributes',
    './meta/CmsGroupFactory',
    'gform/createFullEditorFactory'
], function (urlConverter, TemplateRefAttributeFactory, RequiredAttributes, CmsGroupFactory, createFullEditorFactory) {


    return function () {
        var ef = createFullEditorFactory();
        ef.addGroupFactory("cmsgroup", new CmsGroupFactory({editorFactory: ef}));
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
        ef.addValidator("requiredAttributes", RequiredAttributes);
        ef.addConverterForid(urlConverter,"urlConverter");
        return ef;
    }

});

define([
    'cms/RequiredAttributes',
    './meta/CmsGroupFactory',
    'gform/createFullEditorFactory'
], function (RequiredAttributes, CmsGroupFactory, createFullEditorFactory) {


    return function () {
        var ef = createFullEditorFactory();
        ef.addGroupFactory("cmsgroup", new CmsGroupFactory({editorFactory: ef}));
        ef.addValidator("requiredAttributes", RequiredAttributes);
        return ef;
    }

});

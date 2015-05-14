define([
	'../controller/actions/GenerateSchema',
	'../controller/actions/GoToData',
	'../controller/actions/DiscardAndPreview',
	'./../dynamicstore/SchemaPlainValueFactory',
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
    './refConverter',
    'gform/primitive/nullablePrimitiveConverter',
    '../meta/TemplateRefAttributeFactory',
    '../RequiredAttributes',
	'gform/createFullEditorFactory'
], function (GenerateSchema, GoToData, DiscardAndPreview, PlainValueFactory, urlConverter, SchemaAttributeFactory, stringTemplateConverter, Save, Close, Delete, ActionFactory, FormValidator, AttributeRefFactory, FormAttributeFactory, refConverter, converter, TemplateRefAttributeFactory, RequiredAttributes, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");
        attributeFactoryFinder.addAttributeFactory(new TemplateRefAttributeFactory({editorFactory: ef}));
		attributeFactoryFinder.addAttributeFactory(new SchemaAttributeFactory({editorFactory: ef}));
        ef.addCtrValidator("requiredAttributes", RequiredAttributes);

        ef.getAttributeFactory({type:"binary"}).fileServerUrl=config["fileserver-upload"];//http://localhost:4444/upload";
        ef.getAttributeFactory({type:"binary"}).baseUrl=config["fileserver-download"];//="http://localhost:4444/";

        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");
        ef.addConverterForid(refConverter, "refConverter");
        ef.addConverterForid(stringTemplateConverter, "templateConverter");
		ef.addConverterForid(urlConverter,"urlConverter");


		ef.addAttributeFactory(new FormAttributeFactory({editorFactory: ef}));
        ef.addAttributeFactory(new AttributeRefFactory({editorFactory: ef}));
        ef.addCtrValidator("form",FormValidator);

		var pvf = new SchemaPlainValueFactory({
			idProperty: "id",
			idType: "string"
		});

		ef.putFunction("/mdbcollection/multi-schema/create", pvf.createMultiSchema.bind(pvf));
		ef.putFunction("/mdbcollection/single-schema/create", pvf.createSingleSchema.bind(pvf));

        var af = new ActionFactory();
        af.add({type:Save})
		af.add({type:DiscardAndPreview})
		af.add({type:GenerateSchema});
		af.add({type:GoToData});
		af.add({type:Delete})
		af.add({type:Close});

        ef.actionFactory=af;


        return ef;
    }

});

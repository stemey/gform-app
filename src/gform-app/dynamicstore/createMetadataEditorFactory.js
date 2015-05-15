define([
	'./SchemaPlainValueFactory',
	'../controller/actions/GoToData',
	'../controller/actions/DiscardAndPreview',
	'../controller/actions/Save',
    'gform/controller/actions/Close',
	'gform/controller/actions/Delete',
    'gform/controller/actions/ActionFactory',
	'gform/primitive/nullablePrimitiveConverter',
	'gform/createFullEditorFactory'
], function (SchemaPlainValueFactory, GoToData, DiscardAndPreview, Save, Close, Delete, ActionFactory, converter, createFullEditorFactory) {


    return function (config) {
        var ef = createFullEditorFactory();
        var attributeFactoryFinder = ef.get("attributeFactoryFinder");


        ef.addConverterForType(converter, "ref");
        ef.addConverterForType(converter, "multi-ref");

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

define([
    '../controller/actions/CreateCollection',
	'../util/identityConverter',
	'gform/controller/actions/ActionFactory',
	'../controller/actions/SynchronizeCollections',
	'gform/createFullEditorFactory'
], function (CreateCollection, identityConverter, ActionFactory, SynchronizeCollections, createFullEditorFactory) {


	return function (config) {
		var ef = createFullEditorFactory();
		var attributeFactoryFinder = ef.get("attributeFactoryFinder");

		var af = new ActionFactory();
		af.add({type: SynchronizeCollections});
		af.add({type: CreateCollection});

		ef.actionFactory = af;

		ef.addConverterForid(identityConverter,"identity")


		return ef;
	}

});

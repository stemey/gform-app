define([
	'gform/controller/actions/ActionFactory',
	'../controller/actions/SynchronizeCollections',
	'gform/createFullEditorFactory'
], function (ActionFactory, SynchronizeCollections, createFullEditorFactory) {


	return function (config) {
		var ef = createFullEditorFactory();
		var attributeFactoryFinder = ef.get("attributeFactoryFinder");

		var af = new ActionFactory();
		af.add({type: SynchronizeCollections});

		ef.actionFactory = af;


		return ef;
	}

});

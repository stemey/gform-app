define(['dojo/_base/lang',
	'dstore/legacy/DstoreAdapter'], function (lang, DstoreAdapter) {

	return function (config, props) {
		var props ={};
		props.idProperty = config.idProperty;
		lang.mixin(props,config.storeConfig);
		delete props.storeClass;
		var store = new config.storeConfig.storeClass(props);
		return new DstoreAdapter(store);
	}


});

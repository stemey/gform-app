define(['dojo/_base/lang'
], function (lang) {

	return function (config, meta, props) {
		var props = {};
		props.idProperty = config.idProperty;
		lang.mixin(props, config.storeConfig);
		if (config.target) {
			props.target = lang.replace(config.target, meta);
		}
		delete props.storeClass;
		return new config.storeConfig.storeClass(props);
	}


});

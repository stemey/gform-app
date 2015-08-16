define([
    '../cms/PathStoreMixin',
    '../util/tree/TreeMixin',
	'./load',
	'./StoreFactory',
	'../util/DstoreAdapter',
	"dojo/_base/declare"
], function (PathStoreMixin, TreeMixin, load, StoreFactory, DstoreAdapter, declare) {


	return declare([StoreFactory], {
		create: function (config) {
			var me = this;
			return load([config.storeClass], function (StoreClass) {
				config.dstoreConfig.idProperty = config.idProperty;
				var dstore = new StoreClass(config.dstoreConfig);
				var Adapter=DstoreAdapter;
				if (config.parentProperty) {
					config.dstoreConfig.parentProperty = config.parentProperty;
					Adapter = declare([DstoreAdapter,TreeMixin,PathStoreMixin]);
				}
				var store = new Adapter	(dstore);
				store.idProperty = config.idProperty;
				return me._load(store, config);
			});
		}
	});
});

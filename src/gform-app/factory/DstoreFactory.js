define([
	'./load',
	'./StoreFactory',
	'dstore/legacy/DstoreAdapter',
	"dojo/_base/declare"
], function (load, StoreFactory, DstoreAdapter, declare) {


	return declare([StoreFactory], {
		create: function (config) {
			var me = this;
			return load([config.storeClass], function (StoreClass) {
				config.dstoreConfig.idProperty = config.idProperty;
				var dstore = new StoreClass(config.dstoreConfig);
				var store = new DstoreAdapter(dstore);
				store.idProperty = config.idProperty;
				return me._load(store, config);
			});
		}
	});
});

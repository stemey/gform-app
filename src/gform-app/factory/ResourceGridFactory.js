define([
	'dojo/_base/lang',
	'./SingleStoreGridFactory',
    "dojo/_base/declare"

], function (lang, SingleStoreGridFactory, declare) {



    return declare([], {
        create: function (ctx, config) {

            var grids = [];
            config.storeIds.forEach(function(storeId) {
                var f = new SingleStoreGridFactory();
				var props = {storeId:storeId, title:storeId};
				lang.mixin(props, config.config);
                var grid = f.create(ctx,props);
                grids.push(grid);
            });

            return grids;

        }
    });
});




define([
	'dojo/_base/lang',
	'./ExtendedGridFactory',
    "dojo/_base/declare"

], function (lang, ExtendedGridFactory, declare) {



    return declare([], {
        create: function (ctx, config) {

            var grids = [];
            config.storeIds.forEach(function(storeId) {
                var f = new ExtendedGridFactory();
				var props = {storeId:storeId, title:storeId};
				lang.mixin(props, config.config);
                var grid = f.create(ctx,props);
                grids.push(grid);
            });

            return grids;

        }
    });
});




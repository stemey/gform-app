define([
    './SingleStoreGridFactory',
    "dojo/_base/declare"

], function (SingleStoreGridFactory, declare) {



    return declare([], {
        create: function (ctx, config) {

            var grids = [];
            config.storeIds.forEach(function(storeId) {
                var f = new SingleStoreGridFactory();
                var grid = f.create(ctx,{storeId:storeId, title:storeId});
                grids.push(grid);
            });

            return grids;

        }
    });
});




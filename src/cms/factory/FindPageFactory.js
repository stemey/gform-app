define([
    '../controller/tools/FindPage',
    "dojo/_base/declare"
], function (FindPage, declare) {


    return declare([], {
        create: function (ctx, config) {
            var store = ctx.getStore(config.storeId);
            return new FindPage({label: config.label,  store: store})
        }
    });


});

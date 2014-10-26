define([
    'dojo/_base/lang',
    '../controller/tools/FindPage',
    "dojo/_base/declare"
], function (lang, FindPage, declare) {


    return declare([], {
        create: function (ctx, config) {
            var store = ctx.getStore(config.storeId);
            var props = {};
            lang.mixin(props,config);
            props.store=store;
            return new FindPage(props)
        }
    });


});

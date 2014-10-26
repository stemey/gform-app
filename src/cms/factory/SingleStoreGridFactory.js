define([
    'dojo/_base/lang',
    'dijit/form/Button',
    '../controller/tools/Create',
    'dojo/topic',
    "dojo/_base/declare"
], function (lang, Button, Create, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            var store = ctx.getStore(config.storeId);

        }
    });


});

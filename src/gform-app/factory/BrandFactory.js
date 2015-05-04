define([
    '../controller/tools/Brand',
    "dojo/_base/declare"
], function (Brand, declare) {


    return declare([], {
        create: function (ctx, config) {
            return new Brand(config);
        }
    });


});

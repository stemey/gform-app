define([
    './ContainerFactory',
    'dijit/Toolbar',
    "dojo/_base/declare"
], function (ContainerFactory, Toolbar, declare) {


    return declare([ContainerFactory], {

        create: function (ctx, config) {

            var toolbar = new Toolbar();
            return this.addChildren(ctx, toolbar, config.children);
            //return toolbar;

        }
    });


});

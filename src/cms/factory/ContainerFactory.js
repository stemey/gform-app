define([
    "dojo/_base/declare"
], function (declare) {


    return declare([], {
        addChildren: function (ctx, container, childrenConfigs,callback) {
            childrenConfigs.forEach(function(childConfig) {
                require([childConfig.factoryId], function(factory) {
                    var child=new factory().create(ctx,childConfig);
                    child.title=childConfig.title;
                    if (callback) {
                        callback(child, childConfig);
                    }
                    container.addChild(child);
                })
            }, this);
        }
    });


});

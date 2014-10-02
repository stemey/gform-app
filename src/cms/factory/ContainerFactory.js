define([
    "dojo/_base/declare"
], function (declare) {


    return declare([], {
        addChildren: function (ctx, container, childrenConfigs, callback) {
            var modules = childrenConfigs.map(function (config) {
                return config.factoryId;
            });
            require(modules, function () {
                for (var idx = 0; idx < arguments.length; idx++) {
                    var childConfig = childrenConfigs[idx];
                    var factory = arguments[idx];
                    var child = new factory().create(ctx, childConfig);
                    child.title = childConfig.title;
                    if (callback) {
                        callback(child, childConfig);
                    }
                    container.addChild(child);
                };
            });

        }
    });


});

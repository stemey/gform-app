define([
    'dojo/when',
    "dojo/_base/declare"
], function (when, declare) {


    return declare([], {
        addChildren: function (ctx, container, childrenConfigs, callback) {
            var modules = childrenConfigs.map(function (config) {
                return config.factoryId;
            });
            require(modules, function () {
                for (var idx = 0; idx < arguments.length; idx++) {
                    var childConfig = childrenConfigs[idx];
                    var factory = arguments[idx];
                    var childP = new factory().create(ctx, childConfig);
                    when(childP).then(function(child) {
                        if (Array.isArray(child)) {
                            child.forEach(function(element) {
                                if (callback) {
                                    callback(element, childConfig);
                                }
                                container.addChild(element);

                            })  ;
                        }else{
                            if (callback) {
                                callback(child, childConfig);
                            }
                            container.addChild(child);
                        }


                    });
                };
            });

        }
    });


});

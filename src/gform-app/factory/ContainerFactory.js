define([
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/when',
    "dojo/_base/declare"
], function (all, Deferred, when, declare) {


    return declare([], {
		loadChild: function(config, promise, factory, ctx, container, callback) {
			var childP = new factory().create(ctx, config);
			when(childP).then(function(child) {
				if (Array.isArray(child)) {
					child.forEach(function(element) {
						if (callback) {
							callback(element, config);
						}
						container.addChild(element);

					});
				}else{
					if (callback) {
						callback(child, config);
					}
					container.addChild(child);
				}
				promise.resolve();
			});
		},
        addChildren: function (ctx, container, childrenConfigs, callback) {
            var modules = childrenConfigs.map(function (config) {
                return config.factoryId;
            });
			var childPromises = childrenConfigs.map(function() {
				return new Deferred();
			})
			var deferred = new Deferred();
			var me = this;
            require(modules, function () {
                for (var idx = 0; idx < arguments.length; idx++) {
					me.loadChild(childrenConfigs[idx], childPromises[idx],arguments[idx], ctx, container, callback);
                };
            });
			all(childPromises).then(function() {
				deferred.resolve(container);
			});
			return deferred;

        }
    });


});

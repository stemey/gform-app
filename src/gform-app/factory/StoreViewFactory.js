define([
	'./OnDemandViewCreator',
	'dijit/layout/StackContainer',
	'dojo/Deferred',
	'dojo/promise/all',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (OnDemandViewCreator, StackContainer, Deferred, all, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new StackContainer();
			container.set("style", {width: config.width || "200px", height: "100%"});
			config.children.forEach(function (config) {
				// TODO move to child
				if (config.storeId) {

					var store = ctx.getStore(config.storeId);
					var storeId = store.mainStore ? store.mainStore:store.name;
					ctx.addView({label: config.title || storeId, id: storeId, store:storeId});
				}
			})

			var promises = [];


			config.children.forEach(function (config) {
				var d = new Deferred();
				promises.push(d);
				require([config.factoryId], function (Factory) {
					var store = ctx.getStore(config.storeId);
					var storeId = store.mainStore ? store.mainStore:store.name;
					var creator = {
						isStore: function (store) {
							return store == storeId;
						},
						create: function () {
							var view = new Factory().create(ctx, config);
							return view;
						}
					}
                    var onDemandViewCreator = new OnDemandViewCreator({creator:creator,ctx:ctx, container: container});
                    d.resolve("done");
				});
			});


			var promise;
			container.selectChild(container.getChildren()[0]);

			if (config.controllers) {
				config.controllers.forEach(function (controllerConfig) {
					var d = new Deferred();
					promises.push(d);
					require([controllerConfig.controllerClass], function (ControllerClass) {
						var controller = new ControllerClass();
						controller.start(container, ctx, controllerConfig, d);
					});

				})
			}

			promise = new Deferred();
			all(promises).then(function () {
				promise.resolve(container);
			});


			return promise;
		}
	});


});

define([
	'./OnDemandViewCreator',
	'dijit/layout/StackContainer',
	'dojo/when',
	'dojo/Deferred',
	'dojo/promise/all',
	'dojo/topic',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (OnDemandViewCreator, TabContainer, when, Deferred, all, topic, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new TabContainer();
			var onDemandViewCreator = new OnDemandViewCreator({container: container});
			container.set("style", {width: config.width || "200px", height: "100%"});
			config.children.forEach(function (config) {
				// TODO move to child
				if (config.storeId) {

					var store = ctx.getStore(config.storeId);
					var storeId = store.mainStore ? store.mainStore:store.name;
					ctx.addView({label: config.title || storeId, id: storeId, store:storeId});
				}
			})

			config.children.forEach(function (config) {
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
					onDemandViewCreator.create(creator);
				});
			});


			var promise;
			var me = this;
			var focus = function (evt) {
				if (false && evt.source != this) {
					when(me.started).then(function () {
						var storeChild = container.getChildren().filter(function (child) {
							var store = ctx.getStore(child.storeId);
							var storeId;
							if (store.mainStore) {
								storeId = store.mainStore;
							} else {
								storeId = store.name;
							}
							return storeId == evt.store;
						})[0];
						if (storeChild) {
							container.selectChild(storeChild);
						}
					});
				}
			};


			topic.subscribe("/focus", focus);
			topic.subscribe("/store/focus", focus);

			container.selectChild(container.getChildren()[0]);

			if (config.controllers) {
				var promises = [];
				config.controllers.forEach(function (controllerConfig) {
					var d = new Deferred();
					promises.push(d);
					require([controllerConfig.controllerClass], function (ControllerClass) {
						var controller = new ControllerClass();
						controller.start(container, ctx, controllerConfig, d);
					});

				})
				promise = new Deferred();
				all(promises).then(function () {
					promise.resolve(container);
				});
			} else {
				promise = container;
			}

			return promise;
		}
	});


});

define([
	'dojo/aspect',
	'dijit/layout/TabContainer',
	'dojo/when',
	'dojo/Deferred',
	'dojo/promise/all',
	'dojo/topic',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (aspect, TabContainer, when, Deferred, all, topic, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var container = new TabContainer();
			container.set("style", {width: config.width || "200px", height: "100%"});
			container.own(aspect.before(container, "addChild", function (child) {
				var store = ctx.getStore(child.storeId);
				var name = store.mainStore || store.name;
				ctx.addView({label: child.title || name, id: name});
			}));
			this.addChildren(ctx, container, config.children);
			var promise;
			var me = this;
			var focus = function (evt) {
				if (evt.source != this) {
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
			topic.subscribe(container.id + "-selectChild", function (view) {
				var store = ctx.getStore(view.storeId);
				var storeId;
				if (store.mainStore) {
					storeId = store.mainStore;
				} else {
					storeId = store.name;
				}
				if (storeId) {
					//ctx.set("storeId",storeId);
					topic.publish("/store/focus", {source: this, store: storeId});
					container.layout();
				}
			});
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

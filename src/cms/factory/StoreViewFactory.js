define([
	'dojo/when',
	'dojo/Deferred',
	'dojo/promise/all',
	'dojo/topic',
	'./TabFactory',
	"dojo/_base/declare"
], function (when, Deferred, all, topic, TabFactory, declare) {


	return declare([TabFactory], {
		create: function (ctx, config) {
			var promise;
			var container = this.inherited(arguments);
			var me = this;
			topic.subscribe("/focus", function (evt) {
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
			});

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
				all(promises).then(function() {
					promise.resolve(container);
				});
			} else {
				promise = container;
			}

			return promise;
		}
	});


});

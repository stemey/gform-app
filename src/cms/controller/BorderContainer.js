define([
	'dojox/layout/ToggleSplitter',
	'dijit/layout/BorderContainer',
	'dojo/_base/lang',
	'dojo/topic',
	"dojo/_base/declare"
], function (ToggleSplitter, BorderContainer, lang, topic, declare) {


	return declare([BorderContainer], {
		horizontalChildren: ["left", "right", "center"],
		previewVisible: true,
		storeWidth: null,
		entityWidth: null,
		ctx:null,
		layouts:null,
		layoutId: null,
		constructor: function () {
			this._splitterClass = ToggleSplitter;
		},
		postCreate: function () {
			this.inherited(arguments);
			topic.subscribe("/previewer/toggle", lang.hitch(this, "toggleFullSize"));
			topic.subscribe("/focus", lang.hitch(this, "onChange"));
			topic.subscribe("/store/focus", lang.hitch(this, "onChange"));
		},
		onChange: function(evt) {
			var store = this.ctx.getStore(evt.store);
			var layoutId = store.layout || store.name;
			if(!(layoutId in this.layouts)) {
				layoutId="standard";
			}
			if (layoutId!==this.layoutId) {
				this.switchLayout(layoutId);
			}
		},
		getSplitters: function () {
			if (!this.splitters) {
				this.splitters = {};

				this.getChildren().forEach(function (child) {
					var splitter = child._splitterWidget;
					if (splitter) {
						this.splitters[splitter.region] = splitter;
					}
				}, this);
			}
			return this.splitters;
		},
		getChildByRegion: function (region) {
			return this.getChildren().filter(function (child) {
				return child.region == region;
			}) [0];
		},
		isFullSize: function () {
			var fullSize = true;
			this.getChildren().forEach(function (child) {
				if (child._splitterWidget && child._splitterWidget.get("state") !== "closed") {
					fullSize = false;
				}
			})
			return fullSize;
		},
		toggleFullSize: function () {
			var state = this.isFullSize() ? "full" : "closed";
			this.getChildren().forEach(function (child) {
				var splitter = child._splitterWidget;
				if (splitter && splitter.get("state") != state) {
					splitter.set("state", state);
				}
			});
		},
		restSplitter: function (state) {
			this.getChildren().forEach(function (child) {
				var splitter = child._splitterWidget;
				if (splitter && splitter.get("state") != state) {
					splitter.set("state", state);
				}
			});
		},
		transferSplitter: function (splitter, target) {
			splitter.child = target;
			target._splitterWidget = splitter;
		},
		switchRegion: function (from, to) {
			var fromRegion = from.get("region");
			var toRegion = to.get("region");
			from.set("region", toRegion);
			to.set("region", fromRegion);
		},
		updateCurrentLayout: function () {
			var layout = this.layouts[this.layoutId];
			this.getChildren().forEach(function (child) {
				var appType = child.get("appType");
				var app = layout[appType];
				if (app && app.region !== "center") {
					var width = child.domNode.style.width;
					app.width = width;
					app.state = child._splitterWidget.state;
				}
			}, this);
		},
		switchLayout: function (layoutId) {
			var currentLayout = {};
			if (this.layoutId) {
				this.updateCurrentLayout();
				//this.layouts[this.layoutId] = currentLayout;
			}
			this.layoutId = layoutId;
			this._switchLayout(currentLayout, this.layouts[layoutId]);

		},
		getByAppType: function (appType) {
			var children = this.getChildren().filter(function (child) {
				return child.appType === appType;
			});
			if (children.length == 1) {
				return children[0];
			} else {
				return null;
			}
		},
		_switchLayout: function (old, nu) {
			Object.keys(nu).forEach(function (appType) {
				var child = this.getByAppType(appType);
				var region = nu[appType].region;
				child.set("region", region);
				var splitter = this.getSplitters()[region];
				if (splitter) {
					splitter.set("state","full");
					this.transferSplitter(splitter, child);
				} else {
					child._splitterWidget=null;
				}
				var nuApp = nu[appType];
				if (nuApp.hidden) {
					child.domNode.style.display = "none";
					if (child._splitterWidget) {
						child._splitterWidget.domNode.style.display = "none";
					}
				} else {
					child.domNode.style.display = "block";
					if (child._splitterWidget) {
						child._splitterWidget.domNode.style.display = "block";
					}
					if (nuApp.state) {
						child._splitterWidget.set("state", nuApp.state);
					} else if (child._splitterWidget) {
						child._splitterWidget.set("state", "full");
					}
					if (nuApp.width) {
						child.domNode.style.width = nuApp.width;
					}
				}

			}, this);
			this.layout();
		}
	});
});

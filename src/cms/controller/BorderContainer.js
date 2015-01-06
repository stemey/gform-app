define([
	'dojox/layout/ToggleSplitter',
	'dijit/layout/BorderContainer',
	'dojo/_base/lang',
	'dojo/topic',
	'dojo/dom-geometry',
	"dojo/_base/declare"
], function (ToggleSplitter, BorderContainer, lang, topic, domGeometry, declare) {


	return declare([BorderContainer], {
		horizontalChildren: ["left", "right", "center"],
		originalSizes: null,
		sizesWithCenter: null,
		center: null,
		constructor: function () {
			this._splitterClass = ToggleSplitter;
		},
		postCreate: function () {
			this.inherited(arguments);
			topic.subscribe("/previewer/toggle", lang.hitch(this, "toggleFullSize"));
			topic.subscribe("/previewer/hide", lang.hitch(this, "hideCenter"));
			topic.subscribe("/previewer/show", lang.hitch(this, "showCenter"));
		},
		getChildByRegion: function (region) {
			return this.getChildren().filter(function (child) {
				return child.region == region;
			}) [0];
		},
		isFullSize: function() {
			var fullSize= true;
			this.getChildren().forEach(function (child) {
				if (child._splitterWidget && child._splitterWidget.get("state")!=="closed") {
					fullSize=false;
				}
			})
			return fullSize;
		},
		restoreOriginalSizes: function (sizes) {
			Object.keys(sizes).forEach(function (key) {
				var id = this.getChildByRegion(key).id;
				this._layoutChildren(id, sizes[key]);
			}, this)
		},
		saveOriginalSizes: function () {
			var originalSizes = {};
			this.getChildren().forEach(function (child) {
				if (this.horizontalChildren.indexOf(child.get("region")) >= 0) {
					var size = domGeometry.getContentBox(child.domNode);
					originalSizes[child.region] = size.w;
				}
			}, this);
			return originalSizes;
		},
		toggleFullSize: function () {
			var state = this.isFullSize() ? "full" : "closed";
			this.getChildren().forEach(function (child) {
				var splitter = child._splitterWidget;
				if (splitter && splitter.get("state")!=state) {
					splitter.set("state", state);
				}
			});
		},
		hideCenter: function (sizes) {
			if (this.center == null || this.center.getParent()) {
				this.sizesWithCenter = this.saveOriginalSizes();
				this.center = this.getChildByRegion("center");
				var left = this.getChildByRegion("left");
				this.removeChild(this.center);
				left.set("region", "center");
				this.getChildByRegion("right").domNode.style.width = "50%";
				this.layout();
			}
		},
		showCenter: function () {
			if (this.center && !this.center.getParent()) {
				var left = this.getChildByRegion("center");
				var index = this.getChildren().indexOf(left);
				left.set("region", "left");
				this.addChild(this.center, index + 1);
				this.restoreOriginalSizes(this.sizesWithCenter);
				this.layout();
			}
		}
	});
});

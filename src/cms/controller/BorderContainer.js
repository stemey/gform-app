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
		storeWidth:null,
		constructor: function () {
			this._splitterClass = ToggleSplitter;
		},
		postCreate: function () {
			this.inherited(arguments);
			topic.subscribe("/previewer/toggle", lang.hitch(this, "toggleFullSize"));
			topic.subscribe("/previewer/hide", lang.hitch(this, "hidePreview"));
			topic.subscribe("/previewer/show", lang.hitch(this, "showPreview"));
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
		toggleFullSize: function () {
			var state = this.isFullSize() ? "full" : "closed";
			this.getChildren().forEach(function (child) {
				var splitter = child._splitterWidget;
				if (splitter && splitter.get("state")!=state) {
					splitter.set("state", state);
				}
			});
		},
		restSplitter: function (state) {
			this.getChildren().forEach(function (child) {
				var splitter = child._splitterWidget;
				if (splitter && splitter.get("state")!=state) {
					splitter.set("state", state);
				}
			});
		},
		switchSplitter: function(from,to) {
			var splitter = from._splitterWidget;
			splitter.child=to;
			from._splitterWidget=null;
			to._splitterWidget=splitter;
			return splitter;
		},
		switchRegion: function(from,to) {
			var fromRegion=from.get("region");
			var toRegion=to.get("region");
			from.set("region",toRegion);
			to.set("region",fromRegion);
		},
		hidePreview: function () {
			if (this.previewVisible) {
				this.restSplitter("full");
				var preview = this.getChildByRegion("center");
				var store = this.getChildByRegion("left");
				this.storeWidth=store.domNode.style.width;
				var splitter =this.switchSplitter(store,preview);
				splitter.domNode.style.display="none";
				this.switchRegion(preview,store);
				preview.domNode.style.display="none"
				this.layout();
				this.previewVisible=false;
			}
		},
		showPreview: function () {
			if (!this.previewVisible) {
				var store = this.getChildByRegion("center");
				var preview = this.getChildByRegion("left");
				var splitter = this.switchSplitter(preview,store);
				this.switchRegion(store,preview);
				splitter.domNode.style.display="block";
				preview.domNode.style.display="block";
				store.domNode.style.width=this.storeWidth;
				this.restSplitter("full");
				this.layout();
				this.previewVisible=true;
			}
		}
	});
});

define([
    'dijit/layout/BorderContainer',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/dom-geometry',
    "dojo/_base/declare"
], function (BorderContainer, lang, topic, domGeometry, declare) {


    return declare([ BorderContainer], {
        fullSize: false,
        horizontalChildren: ["left", "right", "center"],
        originalSizes: null,
        sizesWithCenter:null,
        center: null,
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
        },restoreOriginalSizes: function(sizes) {
            Object.keys(sizes).forEach(function (key) {
                var id = this.getChildByRegion(key).id;
                this._layoutChildren(id, sizes[key]);
            }, this)
        },
        saveOriginalSizes: function() {
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
            this.fullSize = !this.fullSize;
            if (this.fullSize) {
                this.originalSizes=this.saveOriginalSizes();
                this.getChildren().forEach(function (child) {
                    if (this.horizontalChildren.indexOf(child.get("region")) >= 0 && child.region != "center") {
                        this._layoutChildren(child.id, 0);
                    }
                }, this);

            } else {
                this.restoreOriginalSizes(this.originalSizes);
            }
        }, hideCenter: function (sizes) {
            if (this.center==null || this.center.getParent()) {
                this.sizesWithCenter = this.saveOriginalSizes();
                this.center = this.getChildByRegion("center");
                var left = this.getChildByRegion("left");
                this.removeChild(this.center);
                left.set("region", "center");
                this.getChildByRegion("right").domNode.style.width="50%";
                this.layout();
            }
        }, showCenter: function () {
            if (this.center && !this.center.getParent()) {
                var left = this.getChildByRegion("center");
                var index = this.getChildren().indexOf(left);
                left.set("region","left");
                this.addChild( this.center,index+1);
                this.restoreOriginalSizes(this.sizesWithCenter);
                this.layout();
            }
        }
    });
});
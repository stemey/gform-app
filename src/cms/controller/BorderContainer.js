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
        postCreate: function () {
            this.inherited(arguments);
            topic.subscribe("/previewer/toggle", lang.hitch(this, "toggleFullSize"));
        },
        toggleFullSize: function () {
            this.fullSize = !this.fullSize;
            if (this.fullSize) {
                this.originalSizes = {};
                this.getChildren().forEach(function (child) {
                    if (this.horizontalChildren.indexOf(child.get("region")) >= 0) {
                        var size = domGeometry.getContentBox(child.domNode);
                        this.originalSizes[child.id] = size.w;
                    }
                }, this);
                this.getChildren().forEach(function (child) {
                    if (this.horizontalChildren.indexOf(child.get("region")) >= 0 && child.region != "center") {
                        this._layoutChildren(child.id, 0);
                    }
                }, this);

            } else {
                Object.keys(this.originalSizes).forEach(function (key) {
                    this._layoutChildren(key, this.originalSizes[key]);
                }, this)
            }
        }
    });
});
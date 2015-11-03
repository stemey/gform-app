define([
    'dojox/layout/ToggleSplitter',
    'dijit/layout/BorderContainer',
    'dojo/_base/lang',
    'dojo/topic',
    "dojo/_base/declare"
], function (ToggleSplitter, BorderContainer, lang, topic, declare) {

// TODO extract functionality to non-widget  type and integrate back into tests
    return declare([BorderContainer], {
        horizontalChildren: ["left", "right", "center"],
        previewVisible: true,
        storeWidth: null,
        entityWidth: null,
        ctx: null,
        layouts: null,
        layoutId: null,
        constructor: function () {
            var me = this;
            this._splitterClass = declare([ToggleSplitter], {
                _toggle: function () {
                    this.inherited(arguments);
                    topic.publish("/container/toggle", {fullSize: me.isFullSize()});
                }
            });
        },
        postCreate: function () {
            this.inherited(arguments);
            topic.subscribe("/previewer/toggle", lang.hitch(this, "toggleFullSize"));
            this.ctx.watch("storeId", lang.hitch(this, "onChange"))
        },
        onChange: function () {
            var store = this.ctx.getCurrentStore();
            var layoutId = store.layout || store.name;
            if (!(layoutId in this.layouts)) {
                layoutId = "standard";
            }
            if (layoutId !== this.layoutId) {
                this.switchLayout(layoutId);
            }
        },
        getSplitters: function () {
            if (!this.splitters) {
                this.splitters = {};

                this.getChildren().filter(function (child) {
                    return this.horizontalChildren.indexOf(child.region) >= 0
                }, this)
                    .forEach(function (child) {
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
        }
        ,
        isFullSize: function () {
            var fullSize = true;
            var splitters = this.getSplitters();
            Object.keys(splitters).forEach(function (key) {
                if (splitters[key].get("state") == "full") {
                    fullSize = false;
                }
            })
            return fullSize;
        }
        ,
        toggleFullSize: function () {
            var state = this.isFullSize() ? "full" : "closed";
            if (state === "closed") {
                this.updateCurrentLayout();
            }
            this.getChildren().forEach(function (child) {
                var splitter = child._splitterWidget;
                if (splitter && splitter.get("state") != state) {
                    if (child.appType) {
                        if (state == "closed") {
                            this.layouts[this.layoutId][child.appType].width = child.domNode.style.width;
                            splitter.set("state", state);
                        } else {
                            var layout = this.layouts[this.layoutId][child.appType];
                            if (layout.state === "closed") {
                                //var width = layout.width;
                                //splitter.set("state", state);
                                //child.domNode.style.width=width;
                            } else {
                                var width = layout.width;
                                splitter.set("state", state);
                                child.domNode.style.width = width;
                            }
                        }
                    } else {
                        splitter.set("state", state);
                    }


                }
            }, this);
            this.layout();
            topic.publish("/container/toggle", {fullSize: this.isFullSize()});
        }
        ,
        restSplitter: function (state) {
            this.getChildren().forEach(function (child) {
                var splitter = child._splitterWidget;
                if (splitter && splitter.get("state") != state) {
                    splitter.set("state", state);
                }
            });
        }
        ,
        transferSplitter: function (splitter, target) {
            splitter.child = target;
            target._splitterWidget = splitter;
        }
        ,
        switchRegion: function (from, to) {
            var fromRegion = from.get("region");
            var toRegion = to.get("region");
            from.set("region", toRegion);
            to.set("region", fromRegion);
        }
        ,
        updateCurrentLayout: function () {
            var layout = this.layouts[this.layoutId];
            this.getChildren().forEach(function (child) {
                var appType = child.get("appType");
                var app = layout[appType];
                if (app && app.region !== "center") {
                    if (child._splitterWidget.state !== "closed") {
                        var width = child.domNode.style.width;
                        if (width != "0px") {
                            app.width = width;
                        }
                    }
                    app.state = child._splitterWidget.state;
                }
            }, this);
        }
        ,
        switchLayout: function (layoutId) {
            var currentLayout = {};
            if (this.layoutId) {
                this.updateCurrentLayout();
            }
            this.layoutId = layoutId;
            this._switchLayout(currentLayout, this.layouts[layoutId]);

        }
        ,
        getByAppType: function (appType) {
            var children = this.getChildren().filter(function (child) {
                return child.appType === appType;
            });
            if (children.length == 1) {
                return children[0];
            } else {
                return null;
            }
        }
        ,
        _switchLayout: function (old, nu) {

            Object.keys(nu).forEach(function (appType) {
                var child = this.getByAppType(appType);
                if (child._splitterWidget && child._splitterWidget.get("state") == "closed") {
                    child._splitterWidget.set("state", "full")
                }
            }, this);
            Object.keys(nu).forEach(function (appType) {
                var child = this.getByAppType(appType);
                var region = nu[appType].region;
                child.set("region", region);
                var splitter = this.getSplitters()[region];
                if (splitter) {
                    splitter.set("state", "full");
                    this.transferSplitter(splitter, child);
                } else {
                    child._splitterWidget = null;
                }
                var nuApp = nu[appType];
                if (nuApp.hidden) {
                    child.domNode.style.display = "none";
                    if (child._splitterWidget) {
                        child._splitterWidget.set("state", "closed");
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
                    if (nuApp.width && nuApp.state !== "closed") {
                        child.domNode.style.width = nuApp.width;
                    }
                }

            }, this);
            this.layout();
        }
    })
        ;
})
;

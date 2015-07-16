define([
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (lang, declare) {


    return declare([], {
        container: null,
        ctx: null,
        creator: null,
        widget: null,
        watchHandle: null,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            this.watchHandle = this.ctx.watch("storeId", this.onFocus.bind(this))
        },
        onFocus: function (evt) {
            var store = this.ctx.get("storeId");
            if (this.creator.isStore(store)) {
                if (this.widget == null) {
                    this.widget = this.creator.create();
                    if (!this.widget) {
                        throw "needs to return a widget";
                    }
                    this.container.addChild(this.widget);
                    this.watchHandle.remove();
                }
                this.container.selectChild(this.widget);
            }
        },
        remove: function () {
            if (this.widget) {
                this.container.removeChild(this.widget);
            }
            this.watchHandle.remove();

        }
    });


});

define([
    'dojo/_base/lang',
    '../controller/BorderContainer',
    'intern!bdd',
    'intern/chai!assert'
], function (lang, BorderContainer, bdd, assert) {


    bdd.describe('BorderContainer', function () {
        var container;

        var layoutNoPreview = {
            entity: {region: "center"},
            preview: {state:"closed", region: "right"},
            store: {region: "left", width: "60%"}
        }

        var layoutDefaultPreview = {
            entity: {region: "right", width: "10%"},
            preview: {region: "center"},
            store: {region: "left", width: "40%"}
        }

        bdd.beforeEach(function () {
            container = new BorderContainer();
            container.layouts = {
                layoutDefaultPreview: layoutDefaultPreview,
                layoutNoPreview: layoutNoPreview
            }
            var widgetPrototype = {
                domNode: {style: {display: "block"}},
                get: function (name) {
                    return this[name];
                },
                set: function (name, value) {
                    this[name] = value;
                }
            };
            container.leftSplitter = Object.create(widgetPrototype);
            container.rightSplitter = Object.create(widgetPrototype);
            container.splitters = {"left": container.leftSplitter, "right": container.rightSplitter};
            container.getSplitters = function () {
                return container.splitters;
            };

            var left = Object.create(widgetPrototype);
            lang.mixin(left, {_splitterWidget: container.leftSplitter, appType: "store", region: "left"});
            var center = Object.create(widgetPrototype);
            lang.mixin(center, {appType: "preview", region: "center"});
            var right = Object.create(widgetPrototype);
            lang.mixin(right, {_splitterWidget: container.rightSplitter, appType: "entity", region: "right"});
            container.children = [left, center, right]
            container.getChildren = function () {
                return container.children;
            }


        });


        bdd.it('test toggleFullSize', function () {

            container.toggleFullSize();
            assert.ok(container.leftSplitter.get("state"), "closed");
            assert.ok(container.rightSplitter.get("state"), "closed");
            container.toggleFullSize();
            assert.ok(container.leftSplitter.get("state"), "full");
            assert.ok(container.rightSplitter.get("state"), "full");

        });

        bdd.it('test switchlayout', function () {

            container.switchLayout("layoutNoPreview");
            var entity = container.getByAppType("entity");
            assert.equal(entity.region, "center");
            var store = container.getByAppType("store");
            assert.equal(store.region, "left");
            var preview = container.getByAppType("preview");
            assert.equal(preview.region,"right");

            assert.equal(store._splitterWidget.state, "full");
            assert.equal(store._splitterWidget, container.leftSplitter);


            assert.equal(preview._splitterWidget.state, "closed");
            assert.equal(preview._splitterWidget, container.rightSplitter);

        });

        bdd.it('test switchlayout and keep width', function () {

            container.switchLayout("layoutDefaultPreview");

            container.getByAppType("entity").domNode.style.width="20%";
            container.switchLayout("layoutNoPreview");
            assert.equal(container.layouts.layoutDefaultPreview.entity.width,"20%");
            assert.equal(container.getByAppType("entity").domNode.style.width, "60%");
            container.switchLayout("layoutDefaultPreview");
            assert.equal(container.getByAppType("entity").domNode.style.width, "20%");

        });

        bdd.it('test switchlayout', function () {

            container.switchLayout("layoutNoPreview");
            container.switchLayout("layoutDefaultPreview");

            assert.equal(container.leftSplitter.get("state"), "full");
            assert.equal(container.rightSplitter.get("state"), "full");
            assert.equal(container.getByAppType("entity").region, "right");
            assert.equal(container.getByAppType("store").region, "left");
            assert.equal(container.getByAppType("preview").region, "center");


            assert.equal(container.getByAppType("entity")._splitterWidget.state, "full");
            assert.equal(container.getByAppType("entity")._splitterWidget, container.rightSplitter);


            assert.equal(container.getByAppType("store")._splitterWidget.state, "full");
            assert.equal(container.getByAppType("store")._splitterWidget, container.leftSplitter);

        });


        bdd.it('test switchlayout', function () {

            container.switchLayout("layoutDefaultPreview");
            container.toggleFullSize();
            container.switchLayout("layoutNoPreview");
            container.switchLayout("layoutDefaultPreview");
            container.toggleFullSize();

            assert.equal(container.leftSplitter.get("state"), "full");
            assert.equal(container.rightSplitter.get("state"), "full");
            assert.equal(container.getByAppType("entity").region, "right");
            assert.equal(container.getByAppType("store").region, "left");
            assert.equal(container.getByAppType("preview").region, "center");


            assert.equal(container.getByAppType("entity")._splitterWidget.state, "full");
            assert.equal(container.getByAppType("entity")._splitterWidget, container.rightSplitter);


            assert.equal(container.getByAppType("store")._splitterWidget.state, "full");
            assert.equal(container.getByAppType("store")._splitterWidget, container.leftSplitter);

        });

    });
});

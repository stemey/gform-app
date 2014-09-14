define([
    '../controller/tools/Create',
    '../controller/tools/Brand',
    'dijit/form/Button',
    'dijit/Toolbar',
    'dijit/layout/ContentPane',
    'dojo/topic',
    "dojo/_base/declare",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (Create, Brand, Button, Toolbar, ContentPane, topic, declare) {


    return declare([], {

        create: function (ctx, config) {

            var pane = new ContentPane();
            var toolbar = new Toolbar();
            pane.addChild(toolbar);
            toolbar.addChild(new Brand());
            toolbar.addChild(new Button({
                label: "create template",
                onClick: function () {
                    topic.publish("/new", {schemaUrl: "/template", url:"/template"})
                }}));
            toolbar.addChild(new Create({label:"create", store:ctx.getStore("/template")}));
            return pane;

        }
    });


});

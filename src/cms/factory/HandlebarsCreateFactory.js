define([
    'dijit/form/DropDownButton',
    '../default/createValueFactory',
    'dojo/_base/lang',
    'dijit/MenuItem',
    'dijit/DropDownMenu',
    'dojo/topic',
    "dojo/_base/declare"
], function (DropDownButton, createValueFactory, lang, MenuItem, DropDownMenu, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            var templateStore = ctx.getStore(config.storeId);
            var instanceStore=ctx.getStore(templateStore.instanceStore);
            var partialValue = createValueFactory(templateStore,instanceStore, true);
            var templateValue = createValueFactory(templateStore,instanceStore, false);
            return this.createDropDown(templateStore, config, [
                {label: "template", value: templateValue},
                {label: "partial", value: partialValue}
            ]);
        },
        createDropDown: function (templateStore, config, values) {
            var menu = new DropDownMenu({ style: "display: none;"});
            values.forEach(function (value) {
                var click = function () {
                    var initialValue = typeof value == "undefined" ? value : lang.clone(value.value);
                    topic.publish("/new", {store: templateStore.name, schemaUrl: templateStore.template, value: initialValue})
                }
                var menuItem = new MenuItem({
                    label: value.label,
                    onClick: click
                });
                menu.addChild(menuItem);
            });

            var button = new DropDownButton({
                label: config.label,
                dropDown: menu,
                storeIds:config.storeIds || []
            })
            return button;
        }

    });

});

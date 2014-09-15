define([
    'dijit/form/ToggleButton',
    'dojo/topic',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/form/ComboButton',
    './ContainerFactory',
    "dojo/_base/declare"
], function (ToggleButton, topic, Menu, MenuItem, ComboButton, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var me = this;
            return new ToggleButton({label:"full size", onClick: function() {
                topic.publish("/previewer/toggle");
            }});
        }
    });


});

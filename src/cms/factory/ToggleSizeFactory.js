define([
    'dijit/form/ToggleButton',
    'dojo/topic',
    './ContainerFactory',
    "dojo/_base/declare"
], function (ToggleButton, topic, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var me = this;
            return new ToggleButton({storeIds: config.storeIds, label: config.label, onClick: function () {
                topic.publish("/previewer/toggle");
            }});
        }
    });


});

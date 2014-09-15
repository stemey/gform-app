define([
    'dijit/form/Button',
    '../controller/tools/Create',
    'dojo/topic',
    "dojo/_base/declare"
], function (Button, Create, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            if (config.storeId) {
                return new Create({label:config.label, store:ctx.getStore(config.storeId)})
            } else {
                return new Button({
                    label: config.label,
                    onClick: function () {
                        topic.publish("/new", {schemaUrl: config.schemaUrl, url:config.url})
                    }})
            }
        }
    });


});

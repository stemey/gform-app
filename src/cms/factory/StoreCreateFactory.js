define([
    'dijit/form/Button',
    'dojo/topic',
    "dojo/_base/declare"
], function (Button, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            return new Button({
                label: config.label,
                excludedStoreIds: config.excludedStoreIds,
                onClick: function () {
                    var storeId = ctx.get("storeId");
                    var schemaUrl = ctx.getStore(storeId).template;
                    topic.publish("/new", {store: storeId, schemaUrl: schemaUrl})
                }})
        }
    });


});

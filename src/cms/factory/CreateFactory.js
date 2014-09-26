define([
    'dijit/form/Button',
    '../controller/tools/Create',
    'dojo/topic',
    "dojo/_base/declare"
], function (Button, Create, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            var entityStore = ctx.getStore(config.storeId);
            if (entityStore.template) {
                return new Button({
                    label: config.label,
                    onClick: function () {
                        topic.publish("/new", {store: entityStore.name, schemaUrl: entityStore.template})
                    }})
            } else {
                var store = ctx.getStore(entityStore.templateStore);
                return new Create({label: config.label, entityStore: entityStore, store: store})
            }
        }
    });


});

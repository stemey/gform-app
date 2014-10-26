define([
    'dojo/_base/lang',
    'dijit/form/Button',
    '../controller/tools/Create',
    'dojo/topic',
    "dojo/_base/declare"
], function (lang, Button, Create, topic, declare) {


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
                var props = {store:store,entityStore:entityStore};
                lang.mixin(props,config);

                return new Create(props)
            }
        }
    });


});

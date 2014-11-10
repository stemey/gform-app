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
					var store = ctx.getStore(storeId);
					var schemaUrl;
					if (store.template) {
						schemaUrl = store.template;
						topic.publish("/new", {store: storeId, schemaUrl: schemaUrl})
					}else{
						var templateStore = ctx.getStore(store.templateStore);
						var p = templateStore.query({});
						p.then(function(schemas) {
							schemaUrl = schemas[0]._id;
							topic.publish("/new", {store: storeId, schemaUrl: schemaUrl})
						})
					}
                }})
        }
    });


});

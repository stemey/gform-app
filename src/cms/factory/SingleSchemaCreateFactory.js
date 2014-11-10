define([
	'../controller/tools/StoreSensitiveMixin',
	'dojo/_base/lang',
	'dijit/form/Button',
	'dojo/topic',
	"dojo/_base/declare"
], function (StoreSensitiveMixin, lang, Button, topic, declare) {


	return declare([], {
		create: function (ctx, config) {
			var CreateButton = new declare([Button,StoreSensitiveMixin], {
				onStoreChange: function() {
					var store = ctx.getStore(ctx.get("storeId"));
					if (store.template) {
						this.inherited(arguments);
					}else{
						this.domNode.style.display="none";
					}
				}
			});
			return new CreateButton({
				label: config.label,
				excludedStoreIds: config.excludedStoreIds,
				includedStoreIds: config.includedStoreIds,
				ctx:ctx,
				onClick: function () {
					var storeId = ctx.get("storeId");
					var store = ctx.getStore(storeId);
					var schemaUrl;
					if (store.template) {
						schemaUrl = store.template;
						topic.publish("/new", {store: storeId, schemaUrl: schemaUrl})
					}
				}
			})
		}
	});


});

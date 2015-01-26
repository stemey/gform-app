define([
	'../controller/tools/Link',
	'../controller/tools/StoreSensitiveMixin',
	'dijit/form/Button',
	'dojo/topic',
	"dojo/_base/declare"
], function (Link, StoreSensitiveMixin, Button, topic, declare) {


	return declare([], {
		create: function (ctx, config) {
			var StoreLinkButton = new declare([Button,StoreSensitiveMixin], {
				onStoreChange: function() {
					var store = ctx.getStore(ctx.get("storeId"));
					if (store.metaStore) {
						this.inherited(arguments);
						this.domNode.style.display="initial";
					}else{
						this.domNode.style.display="none";
					}
				}
			});
			return new StoreLinkButton({
				label: config.label,
				iconClass:config.iconClass,
				excludedStoreIds: config.excludedStoreIds,
				includedStoreIds: config.includedStoreIds,
				ctx:ctx,
				onClick: function () {
					var storeId = ctx.get("storeId");
					var store = ctx.getStore(storeId);
					var schemaUrl;
					if (store.metaStore) {
						topic.publish("/focus", {store: store.metaStore, id: store.metaId})
					}
				}
			})
		}
	});


});

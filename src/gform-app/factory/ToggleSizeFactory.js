define([
	'../controller/tools/StoreSensitiveMixin',
	'dijit/form/Button',
	'dojo/topic',
	'./ContainerFactory',
	"dojo/_base/declare"
], function (StoreSensitiveMixin, ToggleButton, topic, ContainerFactory, declare) {


	return declare([ContainerFactory], {
		create: function (ctx, config) {
			var me = this;
			var Button = new declare("ToggleSizeButton", [ToggleButton, StoreSensitiveMixin], {});
			var button = new Button({
				iconClass:config.expandIconClass, ctx: ctx, includedStoreIds: config.includedStoreIds, label: config.label, onClick: function () {
					topic.publish("/previewer/toggle");
				}
			});
            var handle = topic.subscribe("/container/toggle", function(evt) {
                button.set("iconClass",evt.fullSize?config.compressIconClass:config.expandIconClass)
            })
            button.own(handle);
            return button;
		}
	});


});

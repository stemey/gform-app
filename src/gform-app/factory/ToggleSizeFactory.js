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
			return new Button({
				ctx: ctx, includedStoreIds: config.includedStoreIds, label: config.label, onClick: function () {
					topic.publish("/previewer/toggle");
				}
			});
		}
	});


});

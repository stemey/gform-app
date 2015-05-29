define([
	'../factory/HandlebarsCreateFactory',
	'./createValueFactory',
	"dojo/_base/declare"
], function (HandlebarsCreateFactory, createValueFactory, declare) {


	return declare([HandlebarsCreateFactory], {
		create: function (ctx, config) {
			var templateStore = ctx.getStore(config.storeId);
			var instanceStore = ctx.getStore(templateStore.instanceStore);
			var partialValue = createValueFactory(templateStore, instanceStore, true);
			var templateValue = createValueFactory(templateStore, instanceStore, false);
			if (!config.includedStoreIds) {
				config.includedStoreIds=[config.storeId];
			}
			return this.createDropDown(ctx, templateStore, config, [
				{label: "template", value: templateValue},
				{label: "partial", value: partialValue}
			]);
		}
	});

});

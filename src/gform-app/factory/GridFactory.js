define([
	'gridx/modules/SingleSort',
	'./AbstractGridFactory',
	'gridx/modules/Menu',
	"dojo/_base/declare",
	"gridx/Grid",
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row'
], function (SingleSort, AbstractGridFactory, Menu, declare, Grid, RowHeader, RowSelect) {


	return declare([AbstractGridFactory], {
		create: function (ctx, config) {
			// TODO make filter configurable: currently quickFilter and clientside
			var store = ctx.getStore(config.storeId);

			var props = {};
			props.title = config.title;// if displayed in tab or titlepane
			this.applyGridProperties(props, config);
			props.store = store;
			props.structure = this.convertSchemaToTableStructure(ctx, config, store);
			props.storeId = store.name;
			props.style = {width: "100%"};
			props.modules = [
				Menu,
				{
					moduleClass: RowSelect,
					multiple: false,
					triggerOnCell: true
				},
				SingleSort,
				RowHeader
			];
			this.addFilterModules(props.modules, config, props.structure);

			var templateGrid = new Grid(props);
			this.addStartupListener(templateGrid, store);
			this.addMenuItem(config, templateGrid, store);

			return templateGrid;
		}
	});


});

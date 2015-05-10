define([
	'./AbstractGridFactory',
	'../controller/ExtendedGrid',
	'gridx/modules/Menu',
	"dojo/_base/declare",
	"gridx/Grid",
	"gridx/modules/VirtualVScroller",
	"gridx/modules/ColumnResizer",
	"gridx/modules/SingleSort",
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row'

], function (AbstractGridFactory, ExtendedGrid, Menu, declare, Grid, VirtualVScroller, ColumnResizer, SingleSort, RowHeader, RowSelect) {


	return declare([AbstractGridFactory], {
		/**
		 *
		 * @param ctx
		 * @param config storeId,conditions?,sync?,serverFilter?,schema?
		 * @returns {Grid}
		 */
		create: function (ctx, config) {
			var store = ctx.getStore(config.storeId);


			var props = {width: "100%", height: "100%"};
			props.title = store.name;
			props.storeId = store.name;
			this.applyGridProperties(props, config);
			props.store = store;
			// TODO see Filter.serverMode
			props.filterServerMode = config.serverFilter !== false;
			props.modules = [
				Menu,
				VirtualVScroller,
				{
					moduleClass: RowSelect,
					multiple: true,
					triggerOnCell: true
				},
				RowHeader,
				SingleSort,
				ColumnResizer
			];

			props.structure = this.convertSchemaToTableStructure(ctx, config, store);
			this.addFilterModules(props.modules, config, props.structure);


			var grid = new Grid(props);
			this.addStartupListener(grid, store);
			this.addMenuItem(config, grid, store);

			// TODO use simple grid if no query language defined
			return new ExtendedGrid({
				storeId: grid.storeId,
				title: store.name,
				grid: grid,
				queryLanguage: config.queryLanguage || "ace/mode/json"
			});

		}
	});
});




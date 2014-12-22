define([
	'dijit/MenuItem',
	'dijit/Menu',
	'gridx/modules/Menu',
	'gridx/modules/Filter',
	"gridx/modules/filter/QuickFilter",
	'dojo/aspect',
	'dojo/topic',
	"dojo/_base/declare",
	"gridx/Grid",
	'gridx/core/model/cache/Async',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row'
], function (MenuItem, DijitMenu, Menu, Filter, QuickFilter, aspect, topic, declare, Grid, Cache, RowHeader, RowSelect) {


	return declare([], {
		create: function (ctx, config) {
			// TODO make filter configurable: currently quickFilter and clientside
			var props = {title: "template"};
			props.title = config.title;// if displayed in tab or titlepane
			props.cacheClass = Cache;
			props.structure = config.columns;
			var store = ctx.getStore(config.storeId);
			props.store = store;
			props.storeId = store.name;
			props.style = {width: "100%"};
			props.modules = [
				{
					moduleClass: Filter,
					serverMode: true
				},
				Menu,
				QuickFilter,
				{
					moduleClass: RowSelect,
					multiple: false,
					triggerOnCell: true
				},
				RowHeader
			];
			var templateGrid = new Grid(props);
			aspect.after(templateGrid, "startup", function () {
				templateGrid.connect(templateGrid, 'onRowClick', function (e) {
					var id = templateGrid.select.row.getSelected();
					topic.publish("/focus", {store: store.name, id: id[0], source: this})
				});
			});
			var openAsJson = function () {
				var id = templateGrid.select.row.getSelected()[0];
				topic.publish("/focus", {template: "/fallbackSchema", store: store.name, id: id, source: this})
			}
			var menu = new DijitMenu();
			menu.addChild(new MenuItem({label: "open as json", onClick: openAsJson}));
			templateGrid.menu.bind(menu, {hookPoint: "row"});

			return templateGrid;
		}
	});


});

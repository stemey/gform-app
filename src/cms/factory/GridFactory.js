define([
	'./GformSchema2TableConverter',
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
], function (GformSchema2TableConverter, MenuItem, DijitMenu, Menu, Filter, QuickFilter, aspect, topic, declare, Grid, Cache, RowHeader, RowSelect) {


	return declare([], {
		create: function (ctx, config) {
			// TODO make filter configurable: currently quickFilter and clientside
			var gridxQueryTransform = config.gridxQueryTransform;
			var props = {title: "template"};
			props.title = config.title;// if displayed in tab or titlepane
			props.cacheClass = Cache;
			var store = ctx.getStore(config.storeId);
			props.store = store;
			props.structure = config.columns || this.generateColumns(ctx, store);
			props.storeId = store.name;
			props.style = {width: "100%"};
			props.modules = [
				{
					moduleClass: Filter,
					serverMode: true,
					setupQuery: function (query) {
						// TODO move into queryTransform, to enable typeProperty!='theType'
						mquery = gridxQueryTransform ? gridxQueryTransform.transform(query, {}) : query;
						return mquery;
					}
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
			if (config.menuItems) {
				var menu = new DijitMenu();
				templateGrid.menu.bind(menu, {hookPoint: "row"});
				config.menuItems.forEach(function (ItemType) {
					var item = new ItemType();
					var click = function () {
						item.action({store: store, id: templateGrid.select.row.getSelected()[0]})
					}
					menu.addChild(new MenuItem({label: item.label, onClick: click}));
				});
			}

			return templateGrid;
		},
		generateColumns: function (ctx, store) {
			var schema = ctx.schemaRegistry.get(store.template);
			var generator = new GformSchema2TableConverter();
			return generator.convert(schema);
		}
	});


});

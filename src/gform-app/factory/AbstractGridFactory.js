define([
	'dojo/_base/lang',
	'gridx/core/model/cache/Async',
	'gridx/core/model/cache/Sync',
	'gridx/modules/filter/QuickFilter',
	"gridx/modules/Filter",
	'gridx/modules/filter/FilterBar',
	'./ContainerFactory',
	'dijit/MenuItem',
	'dijit/Menu',
	'./GformSchema2TableConverter',
	'dojo/aspect',
	'dojo/_base/Deferred',
	'dojo/topic',
	"dojo/_base/declare"

], function (lang, Async, Sync, QuickFilter, Filter, FilterBar, ContainerFactory, MenuItem, DijitMenu, GformSchema2TableConverter, aspect, Deferred, topic, declare) {


	var allFilterConditions = {
		"string": ["contain", "equal", "startWith", "endWith", "notEqual", "notContain", "notStartWith", "notEndWith", "isEmpty"],
		"number": ["equal", "greater", "less", "greaterEqual", "lessEqual", "notEqual", "isEmpty"],
		"date": ["equal", "before", "after", "range", "isEmpty"],
		"time": ["equal", "before", "after", "range", "isEmpty"],
		"enum": ["equal", "notEqual", "isEmpty"],
		"boolean": ["equal", "isEmpty"]
	}

	return declare([ContainerFactory], {
		ALL_CONDITIONS: allFilterConditions,
		createTableConverter: function (ef) {
			return new GformSchema2TableConverter({editorFactory: ef});
		},
		applyGridProperties: function (props, config) {
			props.cacheClass = config.sync ? Sync : Async;
		},
		convertSchemaToTableStructure: function (ctx, config, store) {
			if (config.columns) {
				return config.columns;
			}
			var schema;
			if (config.schema) {
				schema = config.schema;
			} else {
				schema = ctx.schemaRegistry.get(store.template);
			}
			var tableStructure = this.createTableConverter(store.editorFactory).convert(schema);
			return tableStructure;
		},
		addFilterModules: function (modules, config, tableStructure) {
			var id2Converter = this.createId2Converter(tableStructure);

			var filterModule = {
				moduleClass: Filter,
				// TODO is serverMode always equal to !sync???
				serverMode: !config.sync,
				setupQuery: function (query) {
					// TODO move into queryTransform, to enable typeProperty!='theType'
					mquery = gridxQueryTransform ? gridxQueryTransform.transform(query, id2Converter) : query;
					return mquery;
				}
			};

			var gridxQueryTransform = config.gridxQueryTransform
			if (gridxQueryTransform && gridxQueryTransform.conditions) {
				filterModule.conditions = config.conditions || gridxQueryTransform.conditions || allFilterConditions;
			}
			modules.push(filterModule);
			if (config.quickFilter) {
				modules.push(
					QuickFilter
				);
			} else {
				modules.push({
					moduleClass: FilterBar,
					type: "all",
					"closeButton": false
				});
			}
		},
		addMenuItem: function (config, grid, store) {
			if (config.menuItems) {
				var menu = new DijitMenu();
				grid.menu.bind(menu, {hookPoint: "row"});
				config.menuItems.forEach(function (cfg) {
					var item;
					if (typeof cfg === "function") {
						item = new cfg();
					} else{
						var props = {};
						lang.mixin(props,cfg);
						delete props.type;
						item = cfg.type(props);
					}
					var click;
					if (item.type == "single") {
						click = function () {
							item.action({store: store, id: grid.select.row.getSelected()[0]})
						}
					} else {
						click = function () {
							item.action({store: store, ids: grid.select.row.getSelected()})
						}
					}
					menu.addChild(new MenuItem({label: item.label, onClick: click}));
				});
			}
		}, addStartupListener: function (grid, store) {
			aspect.after(grid, "startup", function () {
				grid.connect(grid, 'onRowClick', function (e) {
					var id = grid.select.row.getSelected();
					topic.publish("/focus", {store: store.name, id: id, source: this})
				});
			});
		}, createId2Converter: function (tableStructure) {
			var id2Converter = {};
			tableStructure.forEach(function (column) {
				if (column.parser) {
					id2Converter[column.id] = column.parser;
				}
			});
			return id2Converter;
		}
	});
});




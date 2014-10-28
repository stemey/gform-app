define([
    'dojo/aspect',
    'gridx/core/model/cache/Sync',
    './gform2tableStructure',
    'dojo/_base/Deferred',
    'dojo/topic',
    "dojo/_base/declare",
    "gridx/Grid",
    'gridx/core/model/cache/Async',
    "gridx/modules/VirtualVScroller",
    "gridx/modules/ColumnResizer",
    "gridx/modules/SingleSort",
    "gridx/modules/Filter",
    'gridx/modules/filter/FilterBar',
    'gridx/core/model/extensions/Query',
    'gridx/modules/Focus',
    'gridx/modules/RowHeader',
    'gridx/modules/select/Row'

], function (aspect, Sync, gform2tableStructure, Deferred, topic, declare, Grid, Async, VirtualVScroller, ColumnResizer, SingleSort, Filter, FilterBar, Query, Focus, RowHeader, RowSelect) {


    var allFilterConditions = {"string": ["contain", "equal", "startWith", "endWith", "notEqual", "notContain", "notStartWith", "notEndWith", "isEmpty"],
        "number": ["equal", "greater", "less", "greaterEqual", "lessEqual", "notEqual", "isEmpty"],
        "date": ["equal", "before", "after", "range", "isEmpty"],
        "time": ["equal", "before", "after", "range", "isEmpty"],
        "enum": ["equal", "notEqual", "isEmpty"],
        "boolean": ["equal", "isEmpty"]}

    return declare([], {
        convertSchemaToTableStructure: function (ctx, config, storeId) {
            var store = ctx.getStore(storeId);
            var deferred = new Deferred();
            var schema = ctx.schemaRegistry.get(store.template);
            var tableStructure = gform2tableStructure(schema);
            return tableStructure;
        },
        create: function (ctx, config) {

            var store = ctx.getStore(config.storeId);

            var tableStructure = this.convertSchemaToTableStructure(ctx, config, store.name);

            var props = { width: "100%", height: "100%"};
            props.title = store.name;
            props.cacheClass = config.sync ? Sync : Async;
            props.storeId=store.name;
            var conditions = config.conditions || allFilterConditions;

            var filterModule = {
                moduleClass: FilterBar,
                type: "all"
            }

            if (config.conditions) {
                filterModule.conditions = conditions;
            }

            props.store = store;
            props.modules = [
                VirtualVScroller,
                {
                    moduleClass: Filter,
                    serverMode: true
                },
                filterModule,
                {
                    moduleClass: RowSelect,
                    multiple: false,
                    triggerOnCell: true


                },
                Filter,
                RowHeader,
                SingleSort,
                ColumnResizer
            ];


            props.structure = tableStructure;
            var grid = new Grid(props);
            var selected = function (e) {
                topic.publish("/focus", {store: store.name, id: e.id, source: this})
            }
            aspect.after(grid, "startup", function () {
                grid.select.row.connect(grid.select.row, "onSelected", selected);
                grid.connect(grid, 'onRowClick', function (e) {
                    var id = grid.select.row.getSelected();
                    topic.publish("/focus", {store: store.name, id: id, source: this})
                });
            });
            return grid;

        }
    });
});




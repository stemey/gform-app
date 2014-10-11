define([
    'gridx/modules/Filter',
    "gridx/modules/filter/QuickFilter",
    'dojo/on',
    'dojo/aspect',
    'dojo/topic',
    "dojo/_base/declare",
    "gridx/Grid",
    'gridx/core/model/cache/Async',
    "gridx/modules/VirtualVScroller",
    'gridx/modules/RowHeader',
    'gridx/modules/select/Row',
    "dojo/json"
], function (Filter, QuickFilter, on, aspect, topic, declare, Grid, Cache, VirtualVScroller, RowHeader, RowSelect, json) {


    return declare([], {
        create: function (ctx, config) {
            // TODO add quick filter
            // TODO move title to tabContainer?
            var props = {title: "template"};
            props.cacheClass = Cache;
            props.structure = config.columns;
            var store = ctx.getStore(config.storeId);
            props.store = store;
            props.modules = [
                Filter,
                QuickFilter,
                {
                    moduleClass: RowSelect,
                    multiple: false,
                    triggerOnCell: true
                },
                RowHeader
            ];
            var templateGrid = new Grid(props);
            var selected = function (e) {
                topic.publish("/focus", {store: store.name,id: e.id,  source: this})
            }
            aspect.after(templateGrid, "startup", function() {
                templateGrid.select.row.connect(templateGrid.select.row, "onSelected", selected);
                templateGrid.connect(templateGrid, 'onRowClick', function(e){
                    var id =templateGrid.select.row.getSelected();
                    topic.publish("/focus", {store: store.name,id: id,  source: this})
                });
            });
            return templateGrid;
        }
    });


});

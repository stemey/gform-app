define([
    'dojo/aspect',
    'dojo/topic',
    "dojo/_base/declare",
    "gridx/Grid",
    'gridx/core/model/cache/Async',
    "gridx/modules/VirtualVScroller",
    'gridx/modules/RowHeader',
    'gridx/modules/select/Row',
    "dojo/json"
], function (aspect, topic, declare, Grid, Cache, VirtualVScroller, RowHeader, RowSelect, json) {


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
                VirtualVScroller,
                {
                    moduleClass: RowSelect,
                    multiple: false,
                    triggerOnCell: true
                },
                RowHeader
            ];
            var templateGrid = new Grid(props);
            var selected = function () {
                topic.publish("/template/focus", {id: e.id, source: this})
            }
            aspect.after(templateGrid, "startup", function() {
                templateGrid.select.row.connect(templateGrid.select.row, "onSelected", selected);
            });
            return templateGrid;
        }
    });


});

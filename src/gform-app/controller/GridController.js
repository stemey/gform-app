define([
    'dojo/when',
    'gform/opener/SingleEditorDialogOpener',
    'gridx/core/model/cache/Sync',
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
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
    'gridx/modules/select/Row',

    "dojo/json",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "gform/layout/_InvisibleMixin",
    "dojo/text!./grid.html",
    "gform/Context",
    "gform/createLayoutEditorFactory",
    "gform/primitive/nullablePrimitiveConverter",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/Toolbar"
], function (when, SingleEditorDialogOpener, SyncCache, declare, lang, aspect, Grid, AsyncCache, VirtualVScroller, ColumnResizer, SingleSort, Filter, FilterBar, Query, Focus, RowHeader, RowSelect, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin, template, Context, createEditorFactory, identityConverter) {


    // TODO move this to baucis
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin], {
        gridContainer:null,
        select: null,

        postCreate: function () {
            // resource needs to have the foolowing properties
            //      schemaRegistry
            //      storeRegistry
            //      tableStructure
            //      converter for reference aka EditorFactory
            //      schemaUrl
            //
            var storeRegistry = resource.storeRegistry;
            var schemaRegistry = resource.schemaRegistry;

            var structure = resource.tableStructure;

            var props = { width: "100%", height: "100%"};
            props.cacheClass = resource.sync ? SyncCache : AsyncCache;
            props.structure = structure;
            this.store = storeRegistry.get(resource.storeId);
            //this.singleStore = storeRegistry.get(resource.resourceUrl || resource.collectionUrl);
            var conditions = resource.conditions || undefined;

            var filterModule = {
                moduleClass: FilterBar,
                type: "all"
            }

            if (resource.conditions) {
                filterModule.conditions = conditions;
            }

            props.store = this.store;
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
            this.grid = new Grid(props);

            this.grid.select.row.connect(this.grid.select.row, "onSelected", lang.hitch(this, "rowSelected"));
            this.gridContainer.addChild(this.grid);
            this.grid.startup();

        }
    });


});

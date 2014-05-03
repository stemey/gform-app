define([
    'gform/layout/_InvisibleMixin',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "gridx/Grid",
    'gridx/core/model/cache/Async',
    "gridx/modules/VirtualVScroller",
    "gridx/modules/ColumnResizer",
    "gridx/modules/SingleSort",
    "gridx/modules/Filter",
    'gridx/modules/Focus',
    'gridx/modules/RowHeader',
    'gridx/modules/select/Row',
    "dojo/json",
    "dojo/text!./template_columns.json",
    "dojo/text!./page_columns.json",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./grid.html",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (InvisibleMixin, when, declare, lang, aspect, Grid, Cache, VirtualVScroller, ColumnResizer, SingleSort, Filter, Focus, RowHeader, RowSelect, json, templateColumns, pageColumns, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, InvisibleMixin], {
        baseClass: "gformGridController",
        templateString: template,
        ctx: null,
        templateGrid: null,
        pageGrid: null,
        tabContainer: null,
        borderContainer: null,
        createTemplateGrid: function () {
            var props = { id: "templateGrid", title: "template"};
            props.cacheClass = Cache;
            props.structure = json.parse(templateColumns);
            var store = this.ctx.getStore("/template");
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
            this.templateGrid = new Grid(props);
        },
        createPageGrid: function () {
            var props = { id: "pageGrid", title: "pages"};
            props.cacheClass = Cache;
            props.structure = json.parse(pageColumns);
            var store = this.ctx.getStore("/page");
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
            this.pageGrid = new Grid(props);
        },
        startup: function () {
            this.inherited(arguments);

            //this.borderContainer.layout();
        },
        configure: function (ctx) {
            this.ctx = ctx;
            this.createTemplateGrid();
            this.createPageGrid();
            this.templateGrid.select.row.connect(this.templateGrid.select.row, "onSelected", lang.hitch(this, "templateSelected"));
            this.tabContainer.addChild(this.templateGrid);

            this.pageGrid.select.row.connect(this.pageGrid.select.row, "onSelected", lang.hitch(this, "pageSelected"));
            this.tabContainer.addChild(this.pageGrid);
        },
        templateSelected: function (e) {
            this.ctx.opener.openSingle({url: "/template/"+e.id, schemaUrl: "/template"});
        },
        pageSelected: function (e) {

        },
        getSelectedTemplate: function () {
            var selectedArray = this.templateGrid.select.row.getSelected();
            if (selectedArray.length == 1) {
                return selectedArray[0];
            } else {
                return null;
            }
        },
        getSelectedPage: function () {
            var selectedArray = this.pageGrid.select.row.getSelected();
            if (selectedArray.length == 1) {
                return selectedArray[0];
            } else {
                return null;
            }
        }
    });


});

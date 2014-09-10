define([
    '../factory/GridFactory',
    '../factory/TreeFactory',
    'dojo/aspect',
    'cms/util/JsonRest',
    'gform/util/restHelper',
    'dojo/store/Observable',
    'dojo/topic',
    'cms/util/TreeStore',
    'dijit/Tree',
    'gform/layout/_InvisibleMixin',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/_base/lang",
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
    "dojo/text!../config/template-grid.json",
    "dojo/text!../config/page-tree.json",
    "dojo/text!./template_columns.json",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./grid.html",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (GridFactory, TreeFactory, aspect, JsonRest, restHelper, Observable, topic, UrlTreeModel, Tree, InvisibleMixin, when, declare, lang, Grid, Cache, VirtualVScroller, ColumnResizer, SingleSort, Filter, Focus, RowHeader, RowSelect, json, templateGridJson, pageTreeJson, templateColumns, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, InvisibleMixin], {
        baseClass: "gformGridController",
        templateString: template,
        ctx: null,
        templateGrid: null,
        pageGrid: null,
        tabContainer: null,
        borderContainer: null,
        createTemplateGrid: function () {
            this.templateGrid = new GridFactory().create(this.ctx, JSON.parse(templateGridJson));

        },
        createPageGrid: function () {

          var tree =  new TreeFactory().create(this.ctx, JSON.parse(pageTreeJson));
          this.tabContainer.addChild(tree);

        },
        configure: function (ctx, configuration) {
            this.ctx = ctx;
            this.configuration=configuration;
            this.createTemplateGrid();
            this.createPageGrid();
            this.templateGrid.select.row.connect(this.templateGrid.select.row, "onSelected", lang.hitch(this, "templateSelected"));
            this.tabContainer.addChild(this.templateGrid);

        },
        templateSelected: function (e) {
          topic.publish("/template/focus", {id: e.id, source:this})
        },
        onPageFocus: function(evt) {
          if (evt.source!=this) {
            // select in tree??
          }
        },
        nodeClicked: function (node) {
            if (node.id) {
                topic.publish("/page/focus", {id: node.id, source:this, template:node.template});
            }
        },
        getSelectedTemplate: function () {
            // TODO should be unnecessary
            var selectedArray = this.templateGrid.select.row.getSelected();
            if (selectedArray.length == 1) {
                return selectedArray[0];
            } else {
                return null;
            }
        },
        getSelectedPage: function () {
            // TODO should be unnecessary
            var selectedArray = this.pageGrid.select.row.getSelected();
            if (selectedArray.length == 1) {
                return selectedArray[0];
            } else {
                return null;
            }
        }
    });


});

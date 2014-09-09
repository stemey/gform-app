define([
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
    "dojo/text!./template_columns.json",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./grid.html",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (aspect, JsonRest, restHelper, Observable, topic, UrlTreeModel, Tree, InvisibleMixin, when, declare, lang, Grid, Cache, VirtualVScroller, ColumnResizer, SingleSort, Filter, Focus, RowHeader, RowSelect, json, templateColumns, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {


    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, InvisibleMixin], {
        baseClass: "gformGridController",
        templateString: template,
        ctx: null,
        templateGrid: null,
        pageGrid: null,
        tabContainer: null,
        borderContainer: null,
        createTemplateGrid: function () {
            // TODO add quick filter
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

            // TODO make store and model configurable

            var store = new Observable(JsonRest({target:"http://localhost:8080/tree/",idProperty:"id"}));//this.ctx.getStore("/page");
            var me =this;

            var model=new UrlTreeModel({store: store});
            topic.subscribe("/page/added", function(evt) {
                model.createEntity(evt.url);
            });
            topic.subscribe("/page/updated", function(evt) {
                model.updateEntity(evt.entity);
            });
            topic.subscribe("/page/deleted", function(evt) {
                model.deleteEntity(evt.entity);
            });
          topic.subscribe("/page/focus", function(evt) {
            me.onPageFocus(evt.entity);
          });

          var tree = new Tree({title:"pages",label:"  ",labelAttr:"name",model: model, onClick: lang.hitch(this, "nodeClicked")});
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

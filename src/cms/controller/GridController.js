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
    "dojo/text!./page_columns.json",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./grid.html",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (aspect, JsonRest, restHelper, Observable, topic, UrlTreeModel, Tree, InvisibleMixin, when, declare, lang, Grid, Cache, VirtualVScroller, ColumnResizer, SingleSort, Filter, Focus, RowHeader, RowSelect, json, templateColumns, pageColumns, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {


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
            var store = new Observable(JsonRest({target:"http://localhost:8080/tree/",idProperty:"id"}));//this.ctx.getStore("/page");
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
           // var result=this.configuration.pageStore.query();
            // result.observe(function(){
            //  store.notify(arguments);
            //});

            var model=new UrlTreeModel({store: store});
            topic.subscribe("/page/added", function(evt) {
                model.notify(evt.url);
            });
            var tree = new Tree({title:"pages",label:"  ",labelAttr:"name",model: model, onClick: lang.hitch(this, "nodeClicked")});
            this.tabContainer.addChild(tree);

        },
        startup: function () {
            this.inherited(arguments);

            //this.borderContainer.layout();
        },
        configure: function (ctx, configuration) {
            this.ctx = ctx;
            this.configuration=configuration;
            this.createTemplateGrid();
            this.createPageGrid();
            this.templateGrid.select.row.connect(this.templateGrid.select.row, "onSelected", lang.hitch(this, "templateSelected"));
            this.tabContainer.addChild(this.templateGrid);

            //this.pageGrid.select.row.connect(this.pageGrid.select.row, "onSelected", lang.hitch(this, "pageSelected"));
            //this.tabContainer.addChild(this.pageGrid);
        },
        templateSelected: function (e) {
            var url=restHelper.compose(this.configuration.getTemplateUrl(), e.id);
            this.ctx.opener.openSingle({url: "/template/"+ e.id, schemaUrl: "/template"});
        },
        nodeClicked: function (node) {
            if (node.id) {
                topic.publish("/page/focus", {id: node.id, source:this, template:node.template});

                var page = this.ctx.storeRegistry.get("/page").get(node.id);
                var me = this;
                when(page).then(function (p) {
                    // TODO page should really be multi-typed
                    me.ctx.opener.openSingle({url: "/page/" + node.id, schemaUrl: "/template/"+p.template});
                }).otherwise(function (e) {
                        alert("cannot load entity: " + e.stack);
                    });
            }

        },
        pageSelected: function (e) {
            var page = this.ctx.storeRegistry.get("/page").get(e.id);
            var me = this;
            when(page).then(function (p) {
                // TODO page should really be multi-typed
                me.ctx.opener.openSingle({url: "/page/" + e.id, schemaUrl: p.template});
            }).otherwise(function (e) {
                    alert("cannot load entity: " + e.stack);
                });

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

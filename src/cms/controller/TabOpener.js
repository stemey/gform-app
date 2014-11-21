define(['./TabCrudController',
	'dojo/i18n!../nls/messages',
    'dijit/MenuItem',
    'dijit/registry',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'gform/opener/SingleEditorTabOpener',
    'dojo/topic'], function (TabCrudController, messages, MenuItem, registry, declare, lang, SingleEditorTabOpener, topic) {


    return declare([SingleEditorTabOpener], {
        opening: false,
        init: function () {
            topic.subscribe("/focus", lang.hitch(this, "onPageFocus"));
            topic.subscribe(this.tabContainer.id + "-selectChild", lang.hitch(this, "tabSelected"));
            topic.subscribe("/new", lang.hitch(this, "onNew"));


            var menu = registry.byId(this.tabContainer.id + "_tablist_Menu");

            var me = this;
            menu.addChild(
                new MenuItem({
                    label: messages["tabopener.closeall"],
                    ownerDocument: this.tabContainer.ownerDocument,
                    dir: this.tabContainer.dir,
                    lang: this.tabContainer.lang,
                    textDir: this.tabContainer.textDir,
                    onClick: function (evt) {
                        me.closeTabs();
                    }
                })
            );
        },
		createController: function(props) {
			var controller = new TabCrudController(props);
			lang.mixin(controller, this.controllerConfig);
			return controller;
		},
        openSingle: function (param) {
            if (!this.opening) {
                topic.publish("/focus", {store: param.url, id: param.id});
            }
            this.inherited(arguments);
        },
        onPageFocus: function (evt) {
            var me = this;
            if (evt.source != this) {
                me.opening = true;
                try {
                    var store = this.ctx.getStore(evt.store)
					var ef = store.editorFactory;
                    var typeProperty = store.typeProperty;
                    if (!typeProperty) {
                        me.openSingle({url: evt.store, editorFactory: ef, id: evt.id, schemaUrl: store.template});
                    } else {
                        me.openSingle({url: evt.store,  editorFactory: ef,id: evt.id, schemaUrls: [], typeProperty: typeProperty});
                    }
                } finally {
                    me.opening = false;
                }
            }
        },
        closeTabs: function () {
            var closeables = [];
            this.tabContainer.getChildren().forEach(function (tab) {
                if (!tab.editor.hasChanged()) {
                    closeables.push(tab);
                }
            });
            closeables.forEach(function (tab) {
                this.tabContainer.closeChild(tab);
            }, this);
        },
        onNew: function (evt) {
            var store = this.ctx.getStore(evt.store);
            var ef = store.editorFactory;
            if (store.typeProperty) {
                var typeProperty = store.typeProperty;
                this.createSingle({url: evt.store, editorFactory: ef, typeProperty: typeProperty, schemaUrls: [evt.schemaUrl],value:evt.value});
            }else{
                this.createSingle({url: evt.store, editorFactory: ef, schemaUrl: evt.schemaUrl,value:evt.value});
            }
        },
        tabSelected: function (page) {
            // TODO getting store from crudController is lame - move to crudController.onShow??
            var store = page.store;
            var id = store.getIdentity(page.editor.getPlainValue());
            if (id) {
                topic.publish("/focus", {id: id, store: store.name, source: this})
            }
        }
    });

});

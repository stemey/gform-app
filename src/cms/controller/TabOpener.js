define(['dojo/aspect',
	'./TabCrudController',
	'dojo/i18n!../nls/messages',
	'dijit/MenuItem',
	'dijit/registry',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'gform/opener/SingleEditorTabOpener',
	'dojo/topic'], function (aspect, TabCrudController, messages, MenuItem, registry, declare, lang, SingleEditorTabOpener, topic) {


	return declare([SingleEditorTabOpener], {
		opening: false,
		closing: false,
		factoryContext: null,
		init: function () {
			topic.subscribe("/focus", lang.hitch(this, "onPageFocus"));
			topic.subscribe("/new", lang.hitch(this, "onNew"));

			aspect.before(this.tabContainer, "closeChild", function (child) {
				this.closing = true;
				// TODO around is better but somehow does not work
				setTimeout(function () {
					//this.closing = false;
				}.bind(this), 0);
			}.bind(this));
			aspect.after(this.tabContainer, "closeChild", function (value, args) {
				this.closing = false;
				this.onClose(args[0]);
			}.bind(this));
			aspect.after(this.tabContainer, "selectChild", function (promise, args) {
				if (!this.closing) {
					this.tabSelected(args[0]);
				}
			}.bind(this));


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
		onClose: function (page) {
			if (page.store) {
				topic.publish("/store/focus", {source: this, store: this.factoryContext.get("storeId")})
			}
		},
		createController: function (props, options) {
			var controller = new TabCrudController(props);
			// if a schemaUrl was specified, than we don't set the schemaUrlPrefix to the templateStore.
			if (!options.schemaUrl && props.store.templateStore) {
				controller.schemaUrlPrefix = props.store.templateStore;
			}
			lang.mixin(controller, this.controllerConfig);
			return controller;
		},
		openSingle: function (param) {
			if (!this.opening) {
				topic.publish("/focus", {store: param.url, id: param.id});
			}else{
				this.inherited(arguments);
			}
		},
		onPageFocus: function (evt) {
			var me = this;
			if (evt.source != this) {
				me.opening = true;
				try {
					var store = this.ctx.getStore(evt.store)
					var ef = store.editorFactory;
					var typeProperty = store.typeProperty;
					var template = evt.template || store.template;
					if (template) {
						me.openSingle({url: evt.store, editorFactory: ef, id: evt.id, schemaUrl: template});
					} else {
						me.openSingle({
							url: evt.store,
							editorFactory: ef,
							id: evt.id,
							schemaUrls: {store: store.templateStore, searchProperty: "name"},
							typeProperty: typeProperty
						});
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
				this.createSingle({
					url: evt.store,
					editorFactory: ef,
					typeProperty: typeProperty,
					schemaUrls: {schemaUrl: evt.schemaUrl, store: store.templateStore, searchProperty: "name"},
					value: evt.value
				});
			} else {
				this.createSingle({
					url: evt.store,
					editorFactory: ef,
					schemaUrl: evt.schemaUrl || store.template,
					value: evt.value
				});
			}
		},
		tabSelected: function (page) {
			// TODO getting store from crudController is lame - move to crudController.onShow??
			var store = page.store;
			var entity = page.editor.getPlainValue();
			if (!this.opening && entity) {
				var id = store.getIdentity(page.editor.getPlainValue());
				if (id) {
					topic.publish("/focus", {id: id, store: store.name, source: this})
				}
			}
		}
	});

});

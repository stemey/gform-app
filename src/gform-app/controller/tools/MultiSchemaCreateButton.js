define([
	'./StoreSensitiveMixin',
	'dijit/_CssStateMixin',
	'dojo/_base/lang',
	'../../util/topic',
	'dijit/_WidgetsInTemplateMixin',
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./create.html",
	"dijit/form/FilteringSelect"
], function (StoreSensitiveMixin, CssStateMixin, lang, topic, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


	return declare("cms.Create", [_WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin, CssStateMixin, StoreSensitiveMixin], {
		templateString: template,
		select: null,
		button: null,
		selectId: null,
		label: "create",
		baseClass: "search",
		postMixInProperties: function () {
			this.selectId = this.id;
			this.inherited(arguments);
		},
		onStoreChange: function () {
			var storeId = this.ctx.get("storeId");
			var store = this.ctx.getStore(storeId);
			if (store.templateStore) {
				var templateStore = this.ctx.getStore(store.templateStore);
				this.domNode.style.display = "initial";
				this.select.set("store", templateStore);
			} else {
				this.domNode.style.display = "none";
			}
		},
		postCreate: function () {
			var me = this;
			this.inherited(arguments);
			this.select.set("labelAttr", this.labelProperty || this.searchProperty);
			this.select.set("placeHolder", this.placeHolder)
			this.select.set("searchAttr", this.searchProperty);
			topic.subscribe("/added", lang.hitch(this, "updatedStore"));
			topic.subscribe("/updated", lang.hitch(this, "updatedStore"));
			topic.subscribe("/deleted", lang.hitch(this, "updatedStore"));
		},
		updatedStore: function (evt) {
			var templateStoreId = this.ctx.getCurrentStore().templateStore;
			if (evt.store == templateStoreId) {
				var templateStore = this.ctx.getStore(templateStoreId)
				this.select.set("store", templateStore);
			}
		},
		click: function () {
			var templateStore = this.select.get("store");
			topic.publish("/new", {
				source: this,
				store: templateStore.instanceStore,
				schemaUrl: this.select.get("value")
			})
		}
	})
});

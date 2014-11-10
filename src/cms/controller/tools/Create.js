define([
    'dijit/_CssStateMixin',
    'dojo/_base/lang',
    '../../util/topic',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./create.html",
    "dijit/form/FilteringSelect"
], function (CssStateMixin, lang, topic, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Create", [ _WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin, CssStateMixin], {
        templateString: template,
        select: null,
        button: null,
        store: null,
        selectId: null,
        entityStore: null,
        label: "create",
        baseClass: "search",
        postMixInProperties: function () {
            this.selectId = this.id;
            this.inherited(arguments);
        },
        postCreate: function () {
			var me = this;
            this.inherited(arguments);
            this.select.set("labelAttr", this.labelProperty || this.searchProperty);
            this.select.set("placeHolder", this.placeHolder)
            this.select.set("searchAttr",  this.searchProperty);
            //this.select.set("store", this.store);
            //topic.subscribeStore("/added", lang.hitch(this, "updatedStore"), this.store.name);
			//topic.subscribeStore("/updated", lang.hitch(this, "updatedStore"), this.store.name);
			//topic.subscribeStore("/deleted", lang.hitch(this, "updatedStore"), this.store.name);
			this.ctx.watch("storeId", function() {
				var storeId = me.ctx.get("storeId");
				var store = me.ctx.getStore(storeId);
				if (store.template) {
					me.domNode.style.display="none";
				}else{
					var templateStore = me.ctx.getStore(store.templateStore);
					me.domNode.style.display="initial";
					me.select.set("store", templateStore);
				}
			})
        },
        updatedStore: function () {
            this.select.set("store",this.store);
        },
        click: function () {
			var templateStore = this.select.get("store");
			topic.publish("/new", {source: this, store: templateStore.instanceStore, schemaUrl: this.select.get("value")})
        }
    })
});

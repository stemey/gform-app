define([
	'./StoreSensitiveMixin',
	'dojo/_base/lang',
	'../../util/topic',
	'dojo/data/ObjectStore',
	'dijit/_WidgetsInTemplateMixin',
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./create.html",
	"dijit/form/FilteringSelect"
], function (StoreSensitiveMixin, lang, topic, ObjectStore, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


	return declare("cms.FindPage", [_WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin, StoreSensitiveMixin], {
		templateString: template,
		select: null,
		button: null,
		store: null,
		label: "create",
		postCreate: function () {
			this.inherited(arguments);
			this.select.set("labelAttr", this.labelProperty || this.searchProperty);
			this.select.set("placeHolder", this.placeHolder || "find..")
			this.select.set("searchAttr", this.searchProperty);
			this.select.set("store", new ObjectStore(this.store));
			topic.subscribeStore("/added", lang.hitch(this, "updatedStore"), this.store.name);
			topic.subscribeStore("/updated", lang.hitch(this, "updatedStore"), this.store.name);
			topic.subscribeStore("/deleted", lang.hitch(this, "updatedStore"), this.store.name);
		},
		updatedStore: function () {
			this.select.set("store", new ObjectStore(this.store));
		},
		click: function (evt) {
			var id = this.select.get("value");
			if (id) {
				topic.publish("/focus", {source: this, store: this.store.name, id: id});
			}
		}
	})
});

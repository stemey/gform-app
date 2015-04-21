define([
	'dijit/layout/StackContainer',
	'dojo/_base/lang',
	'../util/topic',
	"dojo/_base/declare"
], function (StackContainer, lang, topic, declare) {


	return declare("cms.PreviewDispatcher", [StackContainer], {
		ctx: null,
		postCreate: function () {
			this.inherited(arguments);
			topic.subscribe("/page/navigate", lang.hitch(this, "onPageNavigate"));
			topic.subscribe("/focus", lang.hitch(this, "onPageFocus"));
			topic.subscribe("/updated", lang.hitch(this, "onPageUpdated"));
			topic.subscribe("/deleted", lang.hitch(this, "onPageDeleted"));
			topic.subscribe("/store/focus", lang.hitch(this, "onStoreFocus"));
			topic.subscribe("/modify/update", lang.hitch(this, "invokeIfExist", "onModifyUpdate"));
			topic.subscribe("/modify/cancel", lang.hitch(this, "invokeIfExist", "onModifyCancel"));
		},
		onPageFocus: function (evt) {
			this.delegate("onEntityFocus",evt);

		},
		delegate: function(fn, evt) {
			var store = this.ctx.getStore(evt.store);
			var selected = this._selectChildByStore(store);
			if (selected && typeof this.selectedChildWidget[fn]=="function") {
				selectd[fn](evt);
			}
		},
		_selectChildByStore: function (store) {
			var previewerId = store.previewerId;
			if (previewerId) {
				if (this.selectedChildWidget.previewerId !== previewerId) {
					var selectedChild = null;
					this.getChildren().some(function (child) {
						if (child.previewerId == previewerId) {
							selectedChild = child;
						}
					});
					if (selectedChild) {
						this.selectChild(selectedChild);
						return true;
					}
				} else {
					return true;
				}
			}
			return false;
		}
		,
		onStoreFocus: function (evt) {
			var store = this.ctx.getStore(evt.store);
			this._selectChildByStore(store);
		}
		,
		onPageUpdated: function (evt) {
			this.delegate("onEntityUpdated",evt);
			var store = this.ctx.getStore(evt.store);
			this._selectChildByStore(store);
			this.selectedChildWidget.onEntityUpdated(evt);
		}
		,
		onPageDeleted: function (evt) {
			// TODO display nothing?
			// this.display("/page/"+evt.id);
		}
		,
		onPageRefresh: function (evt) {
			this.delegate("refresh",evt);
		}
		,
		onPageNavigate: function (evt) {
			this.delegate("onEntityNavigate",evt);
		}
		,
		refresh: function () {
			this.delegate("onEntityRefresh",evt);
		}
	});
});

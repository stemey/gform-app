define(['dojo/_base/lang',
	'dojo/_base/declare',
	'dojo/router',
	'dojo/topic'
], function (lang, declare, router, topic) {


	var entityRoute = "/entity/:store/:id/:template?";

	/**
	 * /entity/:store/:entity
	 */
	return declare([], {
		ctx: null,
		constructor: function (props) {
			this.ctx = props.ctx;
			topic.subscribe("/store/focus",lang.hitch(this, "onStoreFocus"));
			topic.subscribe("/focus", lang.hitch(this, "onEntityFocus"));
			router.register(entityRoute, lang.hitch(this, "onGoToEntity"));
			//router.startup();
		},
		start: function() {
			router.startup();
		},
		onStoreFocus: function (evt) {
			this.ctx.set("storeId", evt.store);
			//router.go(storeRoute, evt);
		},
		onEntityFocus: function (evt) {
			this.ctx.set("storeId", evt.store);
			var uri = "/entity/" + encodeURIComponent(evt.store) + "/" + encodeURIComponent(evt.id)
			if (evt.template) {
				uri+="/"+encodeURIComponent(evt.template);
			}
			router.go(uri);
		},
		onGoToEntity: function (hash) {
			var store = decodeURIComponent(hash.params.store);
			var id = decodeURIComponent(hash.params.id);
			var template=null;
			if (hash.params.template) {
				template = decodeURIComponent(hash.params.template);
			}
			// prevent endless recursion.
			if (store != this.ctx.storeId || id != this.ctx.id) {
				this.ctx.set("storeId", store);
				this.ctx.set("id", id);
				var event = {source: this, store: store, id: id};
				if (template) {
					event.template=template;
				}
				topic.publish("/focus", event);
				document.title=store+"/"+id;
			}
			return true;
		}
	});


});

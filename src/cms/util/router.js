define(['dojo/_base/lang',
	'dojo/_base/declare',
	'dojo/router',
	'dojo/topic'
], function (lang, declare, router, topic) {


	var storeRoute = "/store/:store";
	var entityRoute = "/entity/:store/:id";
	var entityTemplateRoute = "/entity/:store/:id/:template";

	/**
	 * /entity/:store/:entity
	 */
	return declare([], {
		ctx: null,
		constructor: function (props) {
			this.ctx = props.ctx;
			topic.subscribe("/store/focus",lang.hitch(this, "onStoreFocus"));
			topic.subscribe("/focus", lang.hitch(this, "onEntityFocus"));
			router.register(storeRoute, lang.hitch(this, "onGoToStore"));
			router.register(entityRoute, lang.hitch(this, "onGoToEntity"));
			router.register(entityTemplateRoute, lang.hitch(this, "onGoToEntity"));
			//router.startup();
		},
		start: function() {
			router.startup();
		},
		onStoreFocus: function (evt) {
			this.ctx.set("storeId", evt.store);
			this.ctx.set("id",null);
			var uri = "/store/" + encodeURIComponent(evt.store);
			router.go(uri);
		},
		onEntityFocus: function (evt) {
			this.ctx.set("storeId", evt.store);
			this.ctx.set("id", evt.id);
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
		},
		onGoToStore: function (hash) {
			var store = decodeURIComponent(hash.params.store);
			// prevent endless recursion.
			if (store != this.ctx.storeId || this.ctx.id!=null) {
				this.ctx.set("storeId", store);
				this.ctx.set("id", null);
				var event = {source: this, store: store};
				topic.publish("/store/focus", event);
				document.title=store;
			}
			return true;
		}
	});


});

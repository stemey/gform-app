define(['dojo/_base/lang',
	'dojo/_base/declare',
	'dojo/router',
	'dojo/topic'
], function (lang, declare, router, topic) {


	var entityRoute = "/entity/:store/:id";

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
			router.go("/entity/" + encodeURIComponent(evt.store) + "/" + encodeURIComponent(evt.id));
		},
		onGoToEntity: function (hash) {
			var store = decodeURIComponent(hash.params.store);
			var id = decodeURIComponent(hash.params.id);
			// prevent endless recursion.
			if (store != this.ctx.storeId || id != this.ctx.id) {
				this.ctx.set("storeId", store);
				this.ctx.set("id", id);
				topic.publish("/focus", {source: this, store: store, id: id})
				document.title=store+"/"+id;
			}
			return true;
		}
	});


});

define([
	'dojo/topic',
	'dijit/MenuItem',
	'dijit/Menu',
	"dojo/_base/declare"
], function (topic, MenuItem, Menu, declare) {


	return declare([Menu], {
		ctx: null,
		postCreate: function () {
			this.inherited(arguments);
			this.populate();
			topic.subscribe("/view/new", this.refresh.bind(this));
			topic.subscribe("/view/deleted", this.refresh.bind(this));
			topic.subscribe("/view/updated", this.refresh.bind(this));
		},
		createMenuItem: function (view) {
			var menuItem = new MenuItem({
				label: view.label,
				onClick: function () {
					topic.publish("/store/focus", {
						store: view.id
					})
				}.bind(this)
			});
			this.addChild(menuItem);
		},
		refresh: function() {
			this.getChildren().forEach(function(child) {
				this.removeChild(child);
			}, this);
			this.populate();
		},
		populate: function () {
			this.remove
			this.ctx.getViews().forEach(function (view) {
				this.createMenuItem(view);
			}, this);
		}

	});


});

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
			this.createDropDown();
			topic.subscribe("/view/new", this.newView.bind(this));
		},
		newView: function (view) {
			this.createMenuItem(view);
		},
		createMenuItem: function (view) {
			var menuItem = new MenuItem({
				label: view.label,
				onClick: function () {
					topic.publish("/store/focus", {
						store: view.id
					})
				}
			});
			this.addChild(menuItem);
		},
		createDropDown: function () {
			this.ctx.getViews().forEach(function (view) {
				this.createMenuItem(view);
			}, this);
		}

	});


});

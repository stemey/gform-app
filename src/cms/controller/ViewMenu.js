define([
	'dijit/PopupMenuItem',
	'dojo/topic',
	'dijit/MenuItem',
	'dijit/Menu',
	'dijit/DropDownMenu',
	"dojo/_base/declare"
], function (PopupMenuItem, topic, MenuItem, Menu, DropDownMenu, declare) {


	return declare([Menu], {
		ctx: null,
		groupItems:null,
		postCreate: function () {
			this.groupItems={};
			this.inherited(arguments);
			this.populate();
			topic.subscribe("/view/new", this.refresh.bind(this));
			topic.subscribe("/view/deleted", this.refresh.bind(this));
			topic.subscribe("/view/updated", this.refresh.bind(this));
		},
		createMenuItem: function (view, parentItem) {
			var menuItem = new MenuItem({
				label: view.label,
				onClick: function () {
					topic.publish("/store/focus", {
						store: view.store
					})
				}.bind(this)
			});
			if (parentItem) {
				parentItem.popup.addChild(menuItem);
			} else {
				this.addChild(menuItem);
			}
		},
		refresh: function() {
			this.groupItems={};
			this.getChildren().forEach(function(child) {
				this.removeChild(child);
			}, this);
			this.populate();
		},
		getOrCreateGroupItem: function(group) {
			var groupItem = this.groupItems[group];
			if (!groupItem) {
				var subMenu = new DropDownMenu({});
				groupItem = new PopupMenuItem({label:
						group, popup: subMenu});
				this.addChild(groupItem);
				this.groupItems[group] = groupItem;
			}

			return groupItem;

		},
		populate: function () {
			this.ctx.getViews().forEach(function (view) {
				var parentItem =null;
				if (view.group) {
					parentItem = this.getOrCreateGroupItem(view.group);
				}
				this.createMenuItem(view, parentItem);
			}, this);
		}

	});


});

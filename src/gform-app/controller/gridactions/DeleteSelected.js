define(['dijit/registry',
	'dojo/_base/declare'], function (registry, declare) {
	return declare([], {
		"label": "delete selected",
		"type": "multiple",
		action: function (options) {
			var ids = options.ids;
			registry.byId("confirmDialog").show({
				title: "delete", message: "Do you really want to delete these "+ids.length+"entities?", callback: function (ok) {
					if (ok) {
						options.ids.forEach(function(id) {
							options.store.remove(id);
						});
					}
				}
			});
		}
	});
});

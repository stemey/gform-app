define(['dijit/registry',
	'dojo/_base/declare'], function (registry, declare) {
	return declare([], {
		"label": "delete",
		"type": "single",
		action: function (options) {
			var id = options.id;
			registry.byId("confirmDialog").show({
				title: "delete", message: "Do you really want to delete this entity?", callback: function (ok) {
					if (ok) {
						options.store.remove(id);
					}
				}
			});
		}
	});
});

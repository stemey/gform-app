define(['dojo/_base/declare',
	'dojo/topic'], function (declare, topic) {
	return declare([], {
		"label": "open as json",
		"type": "single",
		action: function (options) {
			var id = options.id;//grid.select.row.getSelected()[0];
			topic.publish("/focus", {template: "/fallbackSchema", store: options.store.name, id: id, source: this})
		}
	});
});

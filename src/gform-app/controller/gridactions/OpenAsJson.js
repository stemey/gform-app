define(['dojo/_base/lang',
	'dojo/_base/declare',
	'dojo/topic'], function (lang, declare, topic) {
	return declare([], {
		"label": "open as json",
		"type": "single",
		constructor: function (kwArgs) {
			lang.mixin(this, kwArgs);
		},
		action: function (options) {
			var id = options.id;//grid.select.row.getSelected()[0];
			topic.publish("/focus", {
				template: this.fallbackSchema || "/fallbackSchema",
				store: options.store.name,
				id: id,
				source: this
			})
		}
	});
});

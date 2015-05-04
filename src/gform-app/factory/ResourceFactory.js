define([
	'dojo/_base/url',
	'dojo/request/xhr',
	'dojo/promise/all',
	'dojo/_base/Deferred',
	"dojo/_base/declare"
], function (url, xhr, all, Deferred, declare) {


	return declare([], {
		create: function (ctx, config) {
			var main = new Deferred;
			require(['dojo/store/Memory',
				config.storeClass, config.createEditorFactory], function (Memory, Store, createEditorFactory) {
				xhr.get(config.apiUrl, {
					handleAs: "json"
				}).then(function (result) {
					var deferreds = [];
					var metaStore = new Memory();
					ctx.addStore(config.storeId, metaStore);
					result.resources.forEach(function (resource) {
						metaStore.add({name: resource.resourceUrl, template:resource.schemaUrl});
						var deferred = new Deferred();
						deferreds.push(deferred);
						var store = new Store({
							name: resource.resourceUrl,
							template: resource.schemaUrl,
							idProperty: resource.idProperty || config.idProperty,
							target: new url(config.apiUrl, resource.resourceUrl).uri,
							editorFactory: createEditorFactory()
						});
						ctx.storeRegistry.register(resource.resourceUrl, store);
						xhr.get(new url(config.apiUrl, resource.schemaUrl).uri, {
							handleAs: "json"
						}).then(function (schema) {
							ctx.schemaRegistry.register(resource.schemaUrl, schema);
							deferred.resolve("done");
						});
					});
					all(deferreds).then(function () {
						main.resolve("done")
					});
				})
			});
			return main;
		}
	});
});

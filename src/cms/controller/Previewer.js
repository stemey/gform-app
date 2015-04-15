define([
	'../util/topic',
	"dojo/_base/declare",
	"dojo/when",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./Previewer.html"
], function (topic, declare, when, _WidgetBase, _TemplatedMixin, template) {


	return declare("cms.Previewer", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		pageStore: null,
		iframe: null,
		url: null,
		onEntityFocus: function (evt) {
			this.display(evt.store + "/" + evt.id);
		},
		onEntityUpdated: function (evt) {
			this.display(evt.store + "/" + this.pageStore.getIdentity(evt.entity));
		},
		onEntityDeleted: function (evt) {
			// TODO display nothing?
			// this.display("/page/"+evt.id);
		},
		onEntityRefresh: function (evt) {
			this.refresh();
		},
		onEntityNavigate: function (evt) {
			//TODO move to general component or AppController
			var me = this;
			var page = this.pageStore.query({url: evt.url});
			when(page).then(function (pageResults) {
				var id = me.pageStore.getIdentity(pageResults[0]);
				var template = pageResults[0].template;
				if (template) {
					topic.publish("/focus", {id: id, store: me.pageStore.name, source: this});
				}
			});
		},
		rendering: false,
		display: function (url) {
			// TODO improve error reporting
			var me = this;
			var scollToTop = this.url !== url;
			this.url = url;
			var renderer = this.createRenderer();
			when(renderer.render(url))
				.then(function (result) {
					me.rendering = false;
					if (!result.noPage) {

						var html = result.html;
						if (result.errors && result.errors.length > 0) {
							html = "<ul>";
							result.errors.forEach(function (error) {
								html += "<li>" + error.message + "</li>";
							});
							html += "</ul>";
						}
						// remove preexisting amd define
						me.displayHtml(html, scollToTop);

					} else {
						me.style.width = "0px";
					}
				}).otherwise(function (e) {
					alert("cannot render " + e.stack)
				});
		},
		displayHtml: function (html, scollToTop) {
			var ifrm = (this.iframe.contentWindow) ? this.iframe.contentWindow : (this.iframe.contentDocument.document) ? this.iframe.contentDocument.document : this.iframe.contentDocument;

			delete ifrm.define;
			ifrm.document.open();
			ifrm.document.write(html);
			ifrm.document.close();
			if (scollToTop) {
				ifrm.scrollTo(0, 0);
			}

		},
		displayById: function (id) {
			this.display("/page/" + id);
		},
		refresh: function () {
			if (this.url) {
				this.display(this.url);
			}
		}
	});
})
;

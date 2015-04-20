define([
	'./tools/Link',
	'dijit/Toolbar',
	'dojo/aspect',
	'dijit/form/Button',
	'gform/primitive/ace/AceEditor',
	'dijit/layout/BorderContainer',
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (Link, Toolbar, aspect, Button, AceEditor, BorderContainer, lang, declare) {


	return declare([BorderContainer], {
		queryLanguage: "ace/mode/json",
		grid: null,
		queryEditor: null,
		postCreate: function () {
			var queryPanel = new BorderContainer({
				style: {height: "200px"},
				splitter: true,
				gutters: false,
				region: "top"
			});
			// TODO make cnofigurable: querPanel, initial query, language, actions(format might not always be possible)?
			this.queryEditor = new AceEditor({value: "{}", region: 'center', mode: this.queryLanguage});
			var qe = this.queryEditor;
			queryPanel.addChild(this.queryEditor);
			// TODO move styles to css
			var toolbar = new Toolbar({
				style: {
					"border": "0px",
					"border-color": "#b5bcc7",
					"border-top-width": "1px",
					"border-style": "solid"
				}, "region": "bottom"
			});
			toolbar.addChild(new Button({iconClass:'dijitIcon dijitIconClear',label: "clear", onClick: lang.hitch(this, "clear")}));
			toolbar.addChild(new Button({iconClass:"fa fa-code",label: "format", onClick: lang.hitch(this, "format")}));
			toolbar.addChild(new Link({iconClass:"fa fa-question-circle",label: "help", url:"https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts", target:"_blank"}));
			toolbar.addChild(new Button({iconClass:'dijitIcon dijitIconFilter',style: {"float": "right"}, label: "run", onClick: lang.hitch(this, "query")}));
			queryPanel.addChild(toolbar);
			this.grid.set("region", "center");
			this.addChild(queryPanel);
			this.addChild(this.grid);
			aspect.after(this.grid.filter, 'setupQuery', function (ret) {
				// TODO depends on query language
				qe.set("value", JSON.stringify(ret));
				return ret;
			});
		},
		query: function () {
			try {
				var query = this.queryEditor.get("value");
				// TODO move to a configurable transformation
				this.grid.model.query(JSON.parse(query));

				this.grid.body.refresh();
			} catch (e) {
				console.error("cannot query",e);
			}
		},
		clear: function () {
			// TODO depends on query language
			var query = this.queryEditor.set("value", "{}");
		},
		format: function () {
			// TODO depends on query language
			var query = this.queryEditor.get("value");
			this.queryEditor.set("value", JSON.stringify(JSON.parse(query), null, " "));

		}
	});
});

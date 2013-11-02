define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/request",
	"dojo/promise/all",	
	"dojo/when",
	"gform/controller/actions/_ActionMixin",
	//"dojo/i18n!../../nls/messages",	
	
], function(declare, lang, array, domClass, request, all, when, _ActionMixin	){
// module:
//		gform/controller/actions/Save

	
return declare( [_ActionMixin], {
	// summary:
	//		Saves the entity. If the entity was persistent it will be update otherwise it will be inserted.
	messageModule: "actions.preview",
	execute: function() {
			var page = this.ctrl.editor.getPlainValue();
			window.previewer.display(page);	
		}
	});
});

define([
	"dojo/_base/declare",//
	"dojo/_base/lang",//
	"dojo/store/Memory"
], function(declare, lang, Memory){
// module:
//		gform/controller/SchemaRegistry

		
	return declare( [Memory], {
		// summary:
		//		A registry for stores. Makes it easy to reuse and mock stores.

			add: function(value, options) {
				if (value[this.idProperty || "id"]==null) {
					delete value[this.idProperty || "id"];
				}
				return this.inherited(arguments);
			}

	});	
});

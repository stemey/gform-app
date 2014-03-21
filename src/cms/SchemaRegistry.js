define([
	"dojo/_base/declare",
    "dojo/request",
	"gform/util/restHelper"
], function(declare, request, restHelper){
// module:
//		gform/controller/SchemaRegistry

		
	return declare( [], {
		// summary:
		//		A registry for stores. Makes it easy to reuse and mock stores.

			// id2store: object
			//		id (probably url) to store mapping
			url2schema:{},
		
			name2Store: {},

			get: function(url) {
			// summary:
			//		get the schema for the id. If none exist then instantiate the default store with the given properties
			// url: String
			//		the url of the schema
			// return: object | dojo/Promise
				var cached = this.url2schema[url];
				if (cached) {
					return cached;
				} else {
					var ref = restHelper.decompose(url);
					var store = this.name2Store[ref.url];
					if (store) {
						return store.get(ref.id);
					} else {	
						return request.get(url, {handleAs: "json"});
					}
				}

			},
			register: function(url, schema) {
				// summary:
				//		register a store with the id
				// url: String
				//		the url
				// schema: Object
				//		the schema instance
				this.url2schema[url] = schema;
			}	,
			registerStore: function(name, store) {
				// summary:
				//		register a store with the id
				// url: String
				//		the url
				// schema: Object
				//		the schema instance
				this.name2Store[name] = store;
			}	
		});


});

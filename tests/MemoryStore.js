define([
	"dojo/_base/declare",
	"dojo/_base/lang",
], function(declare, lang){

return declare( [ ], {
		url2entity:{},
		findByUrl: function(url) {
			return this.url2entity[url];
		},
		add: function(url, entity) {
			this.url2entity[url]=entity;
		}
	});


});

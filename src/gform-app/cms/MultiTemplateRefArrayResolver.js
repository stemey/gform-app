define([
	'dojo/_base/lang',
	"dojo/_base/declare"
], function (lang, declare) {

	// TOD this attribute is not properly handled by meta.isComplexType etc.
	return declare( [], {
		constructor: function(kwArgs) {
			lang.mixin(this,kwArgs);
		},
		resolve: function (obj) {
			if (obj && obj.type && obj.type=="array" && obj.element && obj.element.editor === "multi-template-ref") {
				//var url = baseUrl + ".." + obj.collectionUrl + "/" + obj.collection;
				var groups=[];
				var templates=[];


				var refs =obj.element.templates.map(function(template){
					var cb = function (value) {
						var group =value.group;
						group.type="object";
						group.code=value.id;
						obj.groups.push(group);
						obj.templates.push(value);
						//obj.type = "object";
						//delete obj.editor;
						//delete obj.editor;// = "object";
					}
					return {store: this.templateStore, id: template, setter: cb}
				},this)

				obj.groups=groups;
				obj.templates=templates;
				delete obj.editor;
				obj.type="array";
				obj.typeProperty="__type__";
				delete obj.element;


				// TODO template store needs to be configured
				return refs;
			} else {
				return false;
			}
		}
	});
});

define([
	"dojo/_base/declare",
	"dojo/store/JsonRest"
], function(declare, JsonRest
    ) {

    return declare( [ JsonRest ], {

        query : function(query,options) {
            var queryString={query: JSON.stringify(query)};
            return this.inherited(arguments, [queryString, options]);
        }

    });

});

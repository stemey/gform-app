define([
    'gform/util/Resolver',
    "dojo/_base/declare"
], function (Resolver, declare) {

	return declare("cms.meta.Resolver",[Resolver], {

        getUrlForRef: function (relUrl, baseUrl) {
            return this.baseUrl+relUrl;
        }
	});
});

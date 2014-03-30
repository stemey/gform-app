define([
    'dojo/_base/url',
    'dojo/_base/declare',
    'gform/util/Resolver'
], function (Url, declare, Resolver) {
// module:
//		gform/util/Resolver


    return declare("cms.Resolver", [Resolver], {
        getUrlForRef: function (relUrl, baseUrl) {
            if (baseUrl=="cms/meta/" && relUrl!="multi-page-ref.json") {
                baseUrl = "gform/schema/";
            }
            var url = new Url(baseUrl, relUrl);
            // need to intercept attributes-no-code.json
            if (url.uri=="gform/schema/attributes.json") {
                return "cms/meta/attributes.json"
            } else {
                return this.inherited(arguments);
            }
        }

    })
});

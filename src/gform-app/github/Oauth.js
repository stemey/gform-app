define([
    'dojo/io-query',
    'dojo/request',
    'dojo/_base/lang',
    "dojo/_base/declare"
], function (ioQuery, request, lang, declare) {

    return declare([], {
        clientId: null,
        redirectUri: null,
        scopes: [],
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },
        getRedirectToGithub: function (state) {
            var query = {
                    client_id: this.clientId,
                    redirect_uri: this.redirectUri,
                    scope: this.scopes.join(","),
                    state: state
            };
            return "https://github.com/login/oauth/authorize?" + ioQuery.objectToQuery(query);
        },
        getAccessToken: function (state, code) {
            data = {
                "client_id": this.clientId,
                "client_secret": this.clientSecret,
                "code": code
            };
            return request.post("https://github.com/login/oauth/access_token", {
                data: data
            })
        }
    });

});

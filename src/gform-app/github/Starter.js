define([
    'dojo/Deferred',
    'dojo/io-query',
    'dojo/_base/url',
    './Oauth',
    "dojo/_base/declare"
], function (Deferred, ioQuery, Url, Oauth, declare) {
    var TOKEN_KEY = "cms4apps_github_access_token";

    return declare([], {
        constructor: function (config) {
            this.oauth = new Oauth({
                scopes: ["repo"],
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                redirectUri: window.location.href
            })
        },
        oauth: null,
        authorize: function (config) {
            var deferred = new Deferred();
            var access_token = window.sessionStorage.getItem(TOKEN_KEY);
            if (!access_token) {
                var url = new Url(window.location.href);
                var code = url.query ? ioQuery.queryToObject(url.query).code : null;
                if (code) {
                    var params = JSON.parse(window.sessionStorage.getItem("config"));
                    var p = this.oauth.getAccessToken(code, params.state);
                    p.then(function (access_token) {
                        window.sessionStorage.setItem(TOKEN_KEY, access_token)
                        deferred.resolve({accessToken: access_token});
                    }, function (e) {
                        deferred.reject(e);
                    })
                } else {
                    var redirect = this.oauth.getRedirectToGithub("11");
                    deferred.resolve({redirectUri: redirect})
                }
            } else {
                deferred.resolve({accessToken: access_token})
            }
            return deferred;
        }
    });

});

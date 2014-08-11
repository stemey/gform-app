define([
    'gform/util/restHelper',
    "dojo/_base/declare"
], function (restHelper, declare) {


    return declare([], {

        findByUrl: function (url) {
            if (url.indexOf("/")==-1) {
                return this.get(url);
            }else{
                var id = restHelper.decompose(url).id;
                return this.get(id);
            }
        }

    });
});

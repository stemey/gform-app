define([
    'gform/util/restHelper',
    "dojo/_base/declare"
], function (restHelper, declare) {


    return declare([], {

        findByUrl: function (url) {
            var id = restHelper.decompose(url).id;
            return this.get(id);
        }

    });
});

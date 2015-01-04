define([
    "dojo/_base/declare"
], function (declare) {

// TODO can we get rid of this?
    return declare([], {

        findByUrl: function (url) {
            if (url.indexOf("/")==-1) {
                return this.get(url);
            }else{
                // TODO should always start with /
                var path = url.match(/^\/?[^\/]+\/(.*)/);
                if (path!=null && path.length>=2) {
                    var id = path[1];
                } else {
                    throw new Error("cannot find "+url);
                }

                return this.get(id);
            }
        }

    });
});

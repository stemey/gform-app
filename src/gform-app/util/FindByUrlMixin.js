define([
    "dojo/_base/declare"
], function (declare) {

// TODO can we get rid of this?
    return declare([], {

        findByUrl: function (url) {
            if (typeof url !== "string" || url.indexOf("/")==-1) {
                return this.get(url);
            }else{
                // TODO should always start with /
                if (url.substring(0,this.name.length+1)==this.name+"/") {
                    return this.get(url.substring(this.name.length+1));
                } else {
                    return this.get(url);
                }
            }
        }

    });
});

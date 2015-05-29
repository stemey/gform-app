define([
    "dojo/_base/declare"
], function (declare) {

    return declare([], {
        basePath: null,
        url2entity: {},
        findByUrl: function (url) {
            return this.url2entity[url];
        },
        add: function (url, entity) {
            this.url2entity[url] = entity;
        },
        get: function (id) {
            return this.url2entity[this.basePath + id];
        }
    });


});

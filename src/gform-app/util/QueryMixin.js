define([
    "dojo/_base/declare"
], function (declare) {


    return declare(null,{
        query: function (query, options) {
            var newQuery = {};

            if (query) {
                Object.keys(query).forEach(function (key) {
                    if (query[key] && typeof query[key] === "object" && query[key].$in) {
                        newQuery[key] = {
                            test: function (value) {
                                return query[key].$in.indexOf(value) >= 0
                            }
                        };
                    } else if (query[key] && typeof query[key] === "object" && query[key].$regex) {
                        newQuery[key] = new RegExp(query[key].$regex);
                    } else {
                        newQuery[key] = query[key];
                    }
                })
            }
            return this.inherited(arguments, [newQuery, options]);
        }
    });
});

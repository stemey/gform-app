define([],
    function () {
        var x = {
            parse: function(value) {
                return "/template/" + value;
            },
            format: function(value) {
                return value.substring(10);
            }
        }
        return x;
    });
define([],
    function () {
        return
        {
            parse: function(value) {
                return "/template/" + value;
            },
            format: function(value) {
                return parseFloat(value.substring(10));
            }
        }
    });
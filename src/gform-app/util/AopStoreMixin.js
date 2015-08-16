define([
    'dojo/when',
    'dojo/aspect',
    "dojo/_base/declare"
], function (when, aspect, declare) {
// module:
//		gform/controller/StoreRegistry


    return declare([], {
        after: function (method, fn, ctx) {
            aspect.after(this, method, function (result, args) {
                when(result).then(function (e) {
                    var newArgs = [result];
                    for (var i = 0; i < args.length - 1; i++) {
                        newArgs.push(args[i]);
                    }
                    fn.apply(ctx, newArgs);
                })
                return result;
            })
        }
    });


});

define([
    '../BaseRenderer',
    "dojo/_base/declare",
    "handlebars/handlebars"
], function (BaseRenderer, declare) {

    // TODO extract helpers to customer and standard configuration folders
    Handlebars.registerHelper('equals', function (a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('gt', function (a, b, options) {
        if (a > b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('gte', function (a, b, options) {
        if (a >= b) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('link', function (url, options) {
        return "javascript:preview('" + url + "');";
    }); 

    Handlebars.registerHelper('formatCurrency', function (value, options) {
        return value/100;
    });


    return declare([BaseRenderer], {
       renderTemplate: function (code, ctx, partials) {
            Object.keys(partials).forEach(function (key) {
                Handlebars.registerPartial(key, partials[key]);
            });
            var template = Handlebars.compile(code);
            return template(ctx);
        }
    })
})


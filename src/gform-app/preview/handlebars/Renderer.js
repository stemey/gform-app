define([
    '../BaseRenderer',
    "dojo/_base/declare"
], function (BaseRenderer, declare) {

    // TODO extract helpers to custom and standard configuration folders
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
    Handlebars.registerHelper('style-tag', function (styles, options) {
        return "<style>" + styles + "</style>"
    });
    Handlebars.registerHelper('link', function (url, options) {
        var param = url;
        if (typeof url === "string") {
            param = "'" + url + "'"
        }
        return "javascript:preview(" + url + ");";
    });

    Handlebars.registerHelper('formatCurrency', function (value, options) {
        return value / 100;
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


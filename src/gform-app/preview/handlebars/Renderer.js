define([
    '../BaseRenderer',
    "dojo/_base/declare"
], function (BaseRenderer, declare) {


    var initHb = function (config) {

        var markedRenderer = new marked.Renderer();
        markedRenderer.link=function(href,title,text) {
            return "<a title=\""+title+"\"href=\"{{link-path '"+href+"'}}\">"+text+"</a>";
        };

        // init marked;
        marked.setOptions({
            renderer: markedRenderer
        });

        function boolExpr(bool, options, ctx) {
            if (options.fn) {
                if (bool) {
                    return options.fn(ctx);
                }
            } else {
                return bool;
            }
        }

        // TODO extract helpers to custom and standard configuration folders
        Handlebars.registerHelper('equals', function (a, b, options) {
            return boolExpr(a == b,options,this);
        });
        Handlebars.registerHelper('gt', function (a, b, options) {
            return boolExpr(a > b,options,this);
        });
        Handlebars.registerHelper("add", function(lvalue, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return lvalue + rvalue;
        });
        Handlebars.registerHelper("concat", function() {
            var value ="";
            for (var i =0;i<arguments.length-1;i++) {
                value+=arguments[i];
            };
            return value;
        });
        Handlebars.registerHelper("richtext", function(value, options) {
            return Handlebars.compile(value)({});
        });
        Handlebars.registerHelper("length", function(arrayValue, options) {
            return Array.isArray(arrayValue) ? arrayValue.length : 0;
        });
        // TODO remove helper
        Handlebars.registerHelper("bs-col", function(arrayValue, options) {
            if (Array.isArray(arrayValue)) {
                return 12/arrayValue.length;
            }else{
                return "not-an-array"
            }
        });
        Handlebars.registerHelper('c4a-script', function (a, b, options) {
            // TODO make script source configurable
            return "<script src='gform-app/controller/mock.js'></script>"
        });
        Handlebars.registerHelper('debug', function (a, b, options) {
            var ctx = a? a : this;
            return  JSON.stringify(ctx, null, ' ');

        });
        Handlebars.registerHelper('gte', function (a, b, options) {
            return boolExpr(a >= b,options,this);

        });
        Handlebars.registerHelper('style-tag', function (styleRef, options) {

            if (config.fileStore) {
                var style=config.fileStore.get(styleRef);
                // TODO is content property universal?
                return "<style>" + style.content + "</style>"
            } else {
                return "<style src='"+styleRef+"'></style>"
            }
        });
        Handlebars.registerHelper('script-tag', function (scriptRef, options) {
            if (config.fileStore) {
                var script=config.fileStore.get(scriptRef);
                // TODO is content property universal?
                return "<style>" + script.content + "</style>"
            } else {
                return "<style src='"+scriptRef+"'></style>"
            }
        });
        Handlebars.registerHelper('image-src', function (imageRef, options) {
            if (config.fileStore) {
                var image=config.fileStore.get(imageRef);
                if (!image) {
                    return "did not find content for "+imageRef;
                }else {
                    // TODO is content property universal?
                    return "data:image/png;base64," + image.content;
                }
            } else {
                return imageRef;
            }
        });
        Handlebars.registerHelper('link', function (id, options) {

            if (typeof id === "string") {
                id = "'" + id + "'"
            }
            return "javascript:preview(" + id + ");";
        });

        Handlebars.registerHelper('link-path', function (path, options) {
            if (path.match(/^(|https|http|email):\/\/.*/)) {
                return path;
            }else {
                // TODO merge with link
                if (typeof path === "string") {
                    path = "'" + path + "'"
                }
                return "javascript:previewByPath(" + path + ");";
            }
        });

        Handlebars.registerHelper('markdown', function (md, options) {
            var hbs =marked(md);
            var html = Handlebars.compile(hbs)({});
            return html;
        });

        Handlebars.registerHelper('formatCurrency', function (value, options) {
            return value / 100;
        });
    }
    // including hb via amd require does not seem to work with dojo build
    if (typeof Handlebars === "undefined") {
        require(["handlebars/handlebars.min"], function (hb) {
            Handlebars = hb;
            initHb();
        })
    } else{
        initHb();
    }


    return declare([BaseRenderer], {
        constructor: function(kwArgs) {
            initHb(kwArgs);
        },
        renderTemplate: function (code, ctx, partials) {
            Object.keys(partials).forEach(function (key) {
                Handlebars.registerPartial(key, partials[key]);
            });
            var template = Handlebars.compile(code);
            ctx.__cms4apps__={sourceCode:code, partials:partials}
            return template(ctx);
        }
    })
})


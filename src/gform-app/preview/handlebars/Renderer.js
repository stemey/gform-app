define([
    '../BaseRenderer',
    "dojo/_base/declare"
], function (BaseRenderer, declare) {


    var initHb = function (config) {

        var markedRenderer = new marked.Renderer();
        markedRenderer.link = function (href, title, text) {
            return "<a title=\"" + title + "\"href=\"{{link-path '" + href + "'}}\">" + text + "</a>";
        };

        markedRenderer.image = function (href, title, text) {
            return "<img alt=\"" + title + "\"src=\"{{image-path '" + href + "'}}\"></img>";
        };

        // init marked;
        marked.setOptions({
            renderer: markedRenderer
        });

        var escapeString = function(value) {
            return "\""+value.replace("\"","\\\"")+"\"";
        }

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
            return boolExpr(a == b, options, this);
        });
        Handlebars.registerHelper('gt', function (a, b, options) {
            return boolExpr(a > b, options, this);
        });
        Handlebars.registerHelper("add", function (lvalue, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return lvalue + rvalue;
        });
        Handlebars.registerHelper("concat", function () {
            var value = "";
            for (var i = 0; i < arguments.length - 1; i++) {
                value += arguments[i];
            }
            ;
            return value;
        });
        Handlebars.registerHelper("richtext", function (value, options) {
            return Handlebars.compile(value)({});
        });
        Handlebars.registerHelper("length", function (arrayValue, options) {
            return Array.isArray(arrayValue) ? arrayValue.length : 0;
        });
        // TODO remove helper
        Handlebars.registerHelper("bs-col", function (arrayValue, options) {
            if (Array.isArray(arrayValue)) {
                return 12 / arrayValue.length;
            } else {
                return "not-an-array"
            }
        });
        Handlebars.registerHelper('c4a-script', function (a, b, options) {
            // TODO make script source configurable
            if (config.preview) {
                return "<script src='gform-app/controller/mock.js'></script>"
            } else {
                return false;
            }
        });
        Handlebars.registerHelper('debug', function (a, b, options) {
            var ctx = a ? a : this;
            return JSON.stringify(ctx, null, ' ');

        });
        Handlebars.registerHelper('gte', function (a, b, options) {
            return boolExpr(a >= b, options, this);

        });
        Handlebars.registerHelper('lib-path', function (source, options) {
            var del = (source.substring(0, 1) == "/") ? "" : "/";
            return config.libBasePath + del + source;
        });
        Handlebars.registerHelper('style-tag', function (styleRef, options) {

            if (config.preview) {
                var style = config.fileStore.get(styleRef);
                // TODO is content property universal?
                return "<style>" + style.content + "</style>"
            } else {
                return "<style src='" + config.assetBasePath + styleRef + "'></style>"
            }
        });
        Handlebars.registerHelper('script-tag', function (scriptRef, options) {
            if (config.fileStore) {
                var script = config.fileStore.get(scriptRef);
                // TODO is content property universal?
                return "<style>" + script.content + "</style>"
            } else {
                return "<style src='" + config.assetBasePath + scriptRef + "'></style>"
            }
        });
        Handlebars.registerHelper('image-src', function (imageRef, options) {
            if (config.preview) {
                var image = config.fileStore.get(imageRef);
                if (!image) {
                    return "did not find content for " + imageRef;
                } else {
                    // TODO is content property universal?
                    return "data:image/png;base64," + image.content;
                }
            } else {
                return config.assetBasePath + imageRef;
            }
        });
        Handlebars.registerHelper('link', function (id, options) {

            if (!id) {
                return "undefined";
            } else if (config.preview) {
                if (typeof id === "string") {
                    id = escapeString(id);
                }
                return "javascript:preview(" + id + ");";
            } else {
                var idx = id.lastIndexOf(".");
                path = idx > 0 ? id.substring(0, idx) : id;
                return config.pageBasePath + path + config.linkExtension;
            }
        });

        Handlebars.registerHelper('link-path', function (path, options) {
            if (path.match(/^(|https|http|email):\/\/.*/)) {
                return path;
            } else {
                // TODO merge with link
                if (config.preview) {
                    if (typeof path === "string") {
                        path = escapeString(path);
                    }
                    return "javascript:previewByPath(" + path + ");";
                } else {
                    var idx = path.lastIndexOf(".");
                    var realPath = idx > 0 ? path.substring(0, idx) : path;
                    return config.pageBasePath + realPath + config.linkExtension;
                }
            }
        });

        Handlebars.registerHelper('image-path', function (path, options) {
            if (config.preview) {
                var images = config.fileStore.query({path: path});
                if (!images || images.length == 0) {
                    return "did not find content for " + path;
                } else {
                    // TODO is content property universal?
                    return "data:image/png;base64," + images[0].content;
                }
            } else {
                return config.assetBasePath + path;
            }
        });

        Handlebars.registerHelper('markdown', function (md, options) {
            var hbs = marked(md);
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
    } else {
        initHb();
    }


    return declare([BaseRenderer], {
        constructor: function (kwArgs) {
            initHb(kwArgs);
        },
        renderTemplate: function (code, ctx, partials) {
            Object.keys(partials).forEach(function (key) {
                Handlebars.registerPartial(key, partials[key]);
            });
            var template = Handlebars.compile(code);
            ctx.__cms4apps__ = {sourceCode: code, partials: partials}
            return template(ctx);
        }
    })
})


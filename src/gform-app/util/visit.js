define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "gform/schema/meta"
], function (array, declare, metaHelper) {
// module:
//		gform/model/visit

    var Visiting = declare(null, {
        constructor: function (visitor) {
            this.visitor = visitor;
        },
        visit: function (schema, model, ctx, missingTypeProperty) {
            if (model) {
                var attributes = metaHelper.collectAttributes(schema);
                if (missingTypeProperty) {
                    //  TODO hack or feature?
                    if (attributes.filter(function(a){a.code==missingTypeProperty}).length==0) {
                        attributes.push({code: missingTypeProperty, type: "string"})
                    }
                }
                array.forEach(attributes, function (attribute) {
                    if (metaHelper.isSingleComplex(attribute)) {
                        this.goonComplex(attribute, model[attribute.code], ctx);
                    } else if (metaHelper.isArray(attribute)) {
                        this.goonArray(attribute, model[attribute.code], ctx);
                    } else {
                        this.goon(attribute, model[attribute.code], ctx);
                    }
                }, this);

            }
        },
        visitAttribute: function (meta, model, ctx) {
            var type = metaHelper.getComplexType(meta, model);
            this.visit(type, model, ctx);
        },
        goon: function (meta, model, ctx) {
            var me = this;
            this.visitor.visit(meta, model, function (x) {
                me.visit(meta, model, x);
            }, ctx);
        },
        goonComplex: function (meta, model, ctx) {
            var me = this;
            this.visitor.visit(meta, model, function (x) {
                me.visitAttribute(meta, model, x);
            }, ctx);
        },
        goonElement: function (meta, model, ctx) {
            if (model) {
                array.forEach(model, function (el, idx) {
                    var missingTypeProperty=null;
                    var single = meta.element || meta.group;
                    if (!single && meta.groups) {
                        var type = el[meta.typeProperty];
                        single = meta.groups.filter(function (g) {
                            return g.code == type;
                        })[0];
                        missingTypeProperty=meta.typeProperty;
                        if (!single) {
                            throw new Error("no type property matches  "+type+ " types "+meta.groups.map(function(g) {
                                    return g.code;
                                }).join(", "));
                        }
                    }
                    var me = this;
                    this.visitor.visitElement(single, el, function (newCtx) {
                        if (meta.group || meta.groups) {
                            me.visit(single, el, newCtx, missingTypeProperty);
                        }
                    }, idx, ctx);
                }, this);
            }
        },
        goonArray: function (meta, model, ctx) {
            if (model) {
                var me = this;
                this.visitor.visitArray(meta, model, function (x) {
                    me.goonElement(meta, model, x);
                }, ctx);
            }
        }
    });

    return function (visitor, meta, model, ctx) {
        new Visiting(visitor).visit(meta, model, ctx);
    };


})





define([
    //
    "dojo/_base/array",//
    "dojo/_base/declare",//
    "gform/schema/meta"//
], function (array, declare, metaHelper) {
// module:
//		gform/model/visit

    var Visiting = declare(null, {
        constructor: function (visitor) {
            this.visitor = visitor;
        },
        visit: function (meta, model, ctx) {
            var attributes = meta.attributes;
            array.forEach(attributes, function (attribute) {
                if (metaHelper.isSingleComplex(attribute)) {
                    this.goonComplex(attribute, model[attribute.code], ctx);
                } else if (metaHelper.isArray(attribute)) {
                    this.goonArray(attribute, model[attribute.code], ctx);
                } else {
                    this.goon(attribute, model[attribute.code], ctx);
                }
            }, this);
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
            array.forEach(model, function (el, idx) {
                var single = meta.element || meta.group;
                var me = this;
                this.visitor.visitElement(single, el, function (x) {
                    //me.visitAttribute(single, el, x);
                }, idx, ctx);
            }, this);
        },
        goonArray: function (meta, model, ctx) {
            var me = this;
            this.visitor.visitArray(meta, model, function (x) {
                me.goonElement(meta, model, x);
            }, ctx);
        }
    });

    return function (visitor, meta, model, ctx) {
        new Visiting(visitor).visit(meta, model, ctx);
    };


})





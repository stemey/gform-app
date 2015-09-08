define([
    'dojo/_base/lang',
    '../meta/TemplateSchemaTransformer',
    '../factory/schema/SchemaStore',
    "dojo/_base/declare"
], function (lang, TemplateSchemaTransformer, SchemaStore, declare) {

    return declare([SchemaStore], {
        constructor: function (kwArgs) {
            var partialStore = kwArgs.ctx.getStore(kwArgs.partialStore);
            var props = {};
            lang.mixin(props, kwArgs);
            props.partialStore = partialStore;
            this.transformer = new TemplateSchemaTransformer(props);
        }
    });


});

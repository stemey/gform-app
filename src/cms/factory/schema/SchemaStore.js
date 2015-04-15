define([
    'dojo/_base/lang',
    'dojo/when',
    'dojo/Deferred',
    "dojo/_base/declare"
], function (lang, when, Deferred, declare) {
// module:
//		gform/controller/SchemaRegistry


    return declare([], {

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },
        transformer: null,
        store:null,

        get: function (id) {
            var p = this.store.get(id);
            var transformedSchema = new Deferred();
            var me = this;
            when(p).then(function (schema) {
				if (schema==null) {
					transformedSchema.reject("schema not found");
				}
                if (me.transformer) {
                    var t = me.transformer.transform(schema);
                    when(t).then(function (transformed) {
						//transformed[this.store.idProperty]=schema[]
                        transformedSchema.resolve(transformed);
                    }).otherwise(function (e) {
                            transformedSchema.reject(e);
                        });
                } else {
                    transformedSchema.resolve(schema);
                }
            }).otherwise(function(e) {
				transformedSchema.reject(e);
			});
            return transformedSchema;
        },
		query: function(q) {
			return this.store.query(q);
		}
    });
});


define([
    'dojo/_base/Deferred',
    'gform/Context',
    "dojo/_base/declare"
], function (Deferred, Context, declare) {

    return declare([Context], {
		// TODO remove this method and hence the class
        getSchemaUrl_NOT_USED: function (store, id) {
            var deferred = new Deferred();
            var me = this;
            var store = this.getStore(store);
            if (store.template) {
                deferred.resolve(store.template);
            }else{
                store.get(id).then(function (entity) {
                    var template = entity[store.typeProperty];
                    deferred.resolve(store.templateStore + "/" + template);
                })
            }
            return deferred;
        }
    });
});


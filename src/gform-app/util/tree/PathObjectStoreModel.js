define([
    './AbstractParentObjectStoreModel',
    "dojo/_base/declare"
], function (AbstractParentObjectStoreModel, declare) {

	return declare([AbstractParentObjectStoreModel], {
        mayHaveChildren: function (object) {
            return  object.type=="dir"
        },
        getParentId: function (obj) {
            var id = this.store.getIdentity(obj);
            var idx=id.lastIndexOf("/");
            if (idx<0) {
                return "";
            }else {
                return id.substr(0,idx);
            }
        }

    });

});

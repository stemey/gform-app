define([
    'dojo/when',
    'dojo/_base/lang',
    'dstore/legacy/DstoreAdapter',
    'dojo/request'
], function (when, lang, DstoreAdapter, request) {

    return function (config, meta, props) {
        var props = {};
        props.idProperty = config.idProperty;
        lang.mixin(props, config.storeConfig);
        if (config.target) {
            props.target = lang.replace(config.target, meta);
        }
        delete props.storeClass;
        var dstore = new config.storeConfig.storeClass(props);
        var store = new DstoreAdapter(dstore);
        if (config.initialDataUrl) {
            var url = lang.replace(config.initialDataUrl, meta);
            when(store.query({})).then(function (results) {
                if (results.length == 0) {
                    request(url, {handleAs: "json"}).then(function (data) {
                        data.forEach(function (e) {
                            store.add(e);
                        });
                    });
                }
            })

        }
        return store;
    }


});

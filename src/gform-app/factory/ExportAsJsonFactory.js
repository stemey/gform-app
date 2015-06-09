define([
    '../controller/tools/Link',
    'dojo/when',
    '../controller/tools/StoreSensitiveMixin',
    'dijit/form/Button',
    'dojo/topic',
    "dojo/_base/declare"
], function (Link, when, StoreSensitiveMixin, Button, topic, declare) {


    return declare([], {
        create: function (ctx, config) {
            var click = function () {
                var storeId = ctx.get("storeId");
                var store = ctx.getStore(storeId);
                when(store.query({})).then(function(results){
                    var str=JSON.stringify(results);
                    var doc = window.document;
                    doc.open("export");
                    doc.write(str);
                    doc.close();
                })

            };
            var ExportButton = new declare([Link, StoreSensitiveMixin], {


            });
            return new ExportButton({
                target:"_blank",
                label: config.label,
                iconClass: config.iconClass,
                excludedStoreIds: config.excludedStoreIds,
                includedStoreIds: config.includedStoreIds,
                ctx: ctx,
                onClick: "click()"
            })
        }
    });


});

define([
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/data/ObjectStore',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./create.html",
    "dijit/form/Select"
], function (lang, topic, ObjectStore, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Create", [ _WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        select: null,
        button: null,
        store:null,
        entityStore:null,
        postCreate: function () {
            this.inherited(arguments);
            //this.button.set("label", this.label);
            this.select.set("labelAttr","name");
            this.select.setStore(new ObjectStore(this.store));
            topic.subscribe("/template/added", lang.hitch(this,"updatedStore"));
            topic.subscribe("/template/updated", lang.hitch(this,"updatedStore"));
            topic.subscribe("/template/deleted", lang.hitch(this,"updatedStore"));
        },
        updatedStore: function() {
            this.select.setStore(new ObjectStore(this.store));
        },
        click: function () {
            topic.publish("/new",{source:this, store:this.entityStore.name, schemaUrl:this.store.name+"/"+this.select.get("value")})
        }
    })
});
define([
    'dijit/_CssStateMixin',
    'dojo/_base/lang',
    '../../util/topic',
    'dojo/data/ObjectStore',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./create.html",
    "dijit/form/FilteringSelect"
], function (CssStateMixin, lang, topic, ObjectStore, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Create", [ _WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin,CssStateMixin], {
        templateString: template,
        select: null,
        button: null,
        store:null,
        selectId:null,
        entityStore:null,
        label:"create",
        baseClass:"search",
        postMixInProperties: function() {
            this.selectId=this.id;
            this.inherited(arguments);
        },
        postCreate: function () {
            this.inherited(arguments);
            //this.button.set("label", this.label);
            this.select.set("labelAttr","code");
            this.select.set("placeHolder","find template..")
            this.select.set("searchAttr","name");
            this.select.set("store",new ObjectStore(this.store));
            topic.subscribeStore("/added", lang.hitch(this,"updatedStore"), this.store.name);
            topic.subscribeStore("/updated", lang.hitch(this,"updatedStore"), this.store.name);
            topic.subscribeStore("/deleted", lang.hitch(this,"updatedStore"), this.store.name);
        },
        updatedStore: function() {
            this.select.setStore(new ObjectStore(this.store));
        },
        click: function () {
            topic.publish("/new",{source:this, store:this.entityStore.name, schemaUrl:this.store.name+"/"+this.select.get("value")})
        }
    })
});
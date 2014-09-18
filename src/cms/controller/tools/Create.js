define([
    'dojo/topic',
    'dojo/data/ObjectStore',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./create.html",
    "dijit/form/Select"
], function (topic, ObjectStore, WidgetsInTemplateMixin, declare, _WidgetBase, _TemplatedMixin, template) {


    return declare("cms.Create", [ _WidgetBase, _TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        select: null,
        button: null,
        store:null,
        postCreate: function () {
            this.inherited(arguments);
            //this.button.set("label", this.label);
            this.select.set("labelAttr","name");
            this.select.setStore(new ObjectStore(this.store));
        },
        click: function () {
            topic.publish("/new",{source:this, url:"/page", schemaUrl:"/template/"+this.select.get("value")})
        }
    })
});
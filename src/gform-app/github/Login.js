define([
    'dijit/form/Button',
    'dijit/form/ValidationTextBox',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_WidgetBase',
    "dojo/_base/declare",
    "dojo/text!./Login.html"
], function (Button, ValidationTextBox, TemplatedMixin, WidgetsInTemplateMixin, _WidgetBase, declare, template) {


    return declare([_WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString:template,
        login: function() {
            if (this.user.get("state")==="" && this.repo.get("state")==="") {
                var config = {};
                config.owner = this.user.get("value");
                config.repo = this.repo.get("value");
                window.sessionStorage.setItem("config", JSON.stringify(config));
                this.callback(config);
            }
        }
    });
});

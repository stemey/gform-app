define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (declare, _WidgetBase, _TemplatedMixin) {


    return declare("cms.Toolbar", [ _WidgetBase, _TemplatedMixin], {
        templateString: '<span class="dijit dijitInline" style="margin-top:2px;margin-left:5px;margin-right:5px"><strong>mini cms</strong></span>'
    })
});
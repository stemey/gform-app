define([
    'dijit/_editor/_Plugin',
    'dijit/_editor/plugins/LinkDialog',
    "dojo/_base/declare"
], function (Plugin, LinkDialog, declare) {

    var CmsLinkDialog = declare( [LinkDialog], {
        htmlTemplate:"<a href=\"{{link-path '${urlInput}'}}\" _djrealurl=\"{{link-path '${urlInput}'}}\" target=\"${targetSelect}\">${textInput}</a>",
        _getCurrentValues: function(a){
            // summary:
            //		Over-ride for getting the values to set in the dropdown.
            // a:
            //		The anchor/link to process for data for the dropdown.
            // tags:
            //		protected
            var url, text, target;
            if(a && a.tagName.toLowerCase() === this.tag){
                url = a.getAttribute('_djrealurl') || a.getAttribute('href');
                var urlMatch = url.match(/\{\{link-path '(.*)'\}\}/)
                if (urlMatch && urlMatch.length>1) {
                    url=urlMatch[1];
                }
                target = a.getAttribute('target') || "_self";
                text = a.textContent || a.innerText;
                this.editor.selection.selectElement(a, true);
            }else{
                text = this.editor.selection.getSelectedText();
            }
            return {urlInput: url || '', textInput: text || '', targetSelect: target || ''}; //Object;
        }
    });
    // Register these plugins
    Plugin.registry["createCmsLink"] = function(){
        return new CmsLinkDialog({command: "createLink"});
    };
    return CmsLinkDialog;
});

define([
    'dijit/_editor/_Plugin',
    'dijit/_editor/plugins/LinkDialog',
    "dojo/_base/declare"
], function (Plugin, LinkDialog, declare) {

    var CmsImgDialog = declare( [LinkDialog.ImgLinkDialog], {
        htmlTemplate: "<img src=\"{{image-path '${urlInput}'}}\" _djrealurl=\"${urlInput}\" alt=\"${textInput}\" />",

        // tag: [protected] String
        //		Tag used for the link type (img).
        tag: "img",
        _getCurrentValues: function(img){
            // summary:
            //		Over-ride for getting the values to set in the dropdown.
            // a:
            //		The anchor/link to process for data for the dropdown.
            // tags:
            //		protected
            var url, text;
            if(img && img.tagName.toLowerCase() === this.tag){
                url = img.getAttribute('_djrealurl') || img.getAttribute('src');
                var urlMatch = url.match(/\{\{image-path '(.*)'\}\}/)
                if (urlMatch && urlMatch.length>1) {
                    url=urlMatch[1];
                }
                text = img.getAttribute('alt');
                this.editor.selection.selectElement(img, true);
            }else{
                text = this.editor.selection.getSelectedText();
            }
            return {urlInput: url || '', textInput: text || ''}; //Object;
        }
    });
    // Register these plugins
    Plugin.registry["insertCmsImage"] = function(){
        return new CmsImgDialog({command: "insertImage"});
    };
    return CmsImgDialog;
});

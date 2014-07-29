/*jshint unused:false*/
var dojoConfig = {
    async: true,
    baseUrl: '',
    tlmSiblingOfDojo: false,
    isDebug: true,
    packages: [
        'dojo',
        'dijit',
        'dojox',
        'cms',
        {name: 'ace', location: 'ace-builds/src-noconflict'}
    ],
    deps: [ 'cms',
        "dijit/_editor/plugins/FullScreen",
        "dijit/_editor/plugins/AlwaysShowToolbar",
        "dojox/editor/plugins/ShowBlockNodes",
        "dojox/editor/plugins/FindReplace",
        "dojox/editor/plugins/LocalImage",
        "dijit/_editor/plugins/LinkDialog",
        "dijit/_editor/plugins/ToggleDir",
        "dijit/_editor/plugins/FontChoice",
        "dijit/_editor/plugins/TextColor",
        "dijit/_editor/plugins/ViewSource",
        "dijit/_editor/plugins/Print"
    ],
    callback: function (cms) {
        cms();
    }
};

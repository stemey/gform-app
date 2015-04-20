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
		'gform',
		'gridx',
        'cms',
		"handlebars",
        {name: 'ace', location: 'ace-builds/src-noconflict'}
    ],
    deps: [ 'cms'
    ],
    callback: function (cms) {
        cms();
    }
};

/*jshint unused:false*/
/*
these packages are copied to the dist folder. no minification or whatever
 */
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
		'dstore',
		'gridx',
		'components-font-awesome',
        'gform-app',
        {name: 'ace', location: 'ace-builds/src-noconflict'}
    ]
};

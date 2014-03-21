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
        {name: 'ace', location: 'ace/lib/ace'}
	],
	deps: [ 'cms' ],
	callback: function (cms) {
		cms();
	}
};

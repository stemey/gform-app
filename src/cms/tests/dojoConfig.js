/*jshint unused:false*/
var dojoConfig = {
	async: true,
	baseUrl: '../',//location.pathname.replace(/\/cms\/.*$/, '/'),
	tlmSiblingOfDojo: false,
	isDebug: true,
	packages: [
		'dojo',
		'dijit',
		'dojox',
		'cms',
        'mustache'
	],
	deps: [ 'cms/tests/ready' ]
};

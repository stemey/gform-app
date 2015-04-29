define(['dojo/_base/lang',
	'dojo/_base/declare'], function (lang, declare) {
	var Config = declare([],{
		init: function (kwArgs) {
			lang.mixin(this, kwArgs);
		}
	});
	return new Config();
});

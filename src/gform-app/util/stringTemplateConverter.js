define([],
	function () {
		var x = {
			parse: function (value) {
				return value;//"/template/" + value;
			},
			format: function (value) {
				return value;//value.substring(10);
			}
		}
		return x;
	});

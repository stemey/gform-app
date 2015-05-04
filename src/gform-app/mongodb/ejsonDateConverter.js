define([],
	function () {
		var x = {
			parse: function (value) {
				if (!value) {
					return null;
				} else {
					return {$date: value.getTime()};
				}
			},
			format: function (value) {
				if (value) {
					return new Date(value.$date);
				} else {
					return null;
				}
			}
		}
		return x;
	});

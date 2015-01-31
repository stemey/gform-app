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
				return new Date(value.$date);
			}
		}
		return x;
	});

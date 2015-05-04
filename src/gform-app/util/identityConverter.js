define([],
	function () {
		var identity = function (value) {
			return value;
		}

		var x =
		{
			"parse": identity,
			"format": identity
		}
		return x;
	});

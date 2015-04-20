define([],
	function () {
		function parse(value) {
			return "/template/" + value;
		}

		function format(value) {
			return parseFloat(value.substring(10));
		}

		var converter =
		{
			parse: parse
			,
			format: format
		}
		return converter;
	});

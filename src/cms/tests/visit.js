define([
	'cms/util/visit',
	'intern!bdd',
	'intern/chai!assert'
], function (visit, bdd, assert) {


	bdd.describe('visit', function () {
		var renderer;

		bdd.before(function () {

		});

		bdd.after(function () {

		});

		bdd.it('should visit primitive attributes ', function () {
			var schema = {
				attributes: [
					{
						code:"test",
						type:"string"
					}
				]
			}
			var visitor = {
				visit: function (attribute, model) {
					assert.equal(attribute.code, "test");
				}
			};
			visit(visitor, schema, {});

		});

		bdd.it('should visit group ', function () {
			var schema = {
				attributes: [
					{
						code:"test",
						type:"string"
					}
				]
			}
			var visitor = {
				visit: function (attribute, model) {
					assert.equal(attribute.code, "test");
				}
			};
			visit(visitor, schema, {});

		});


	});
});

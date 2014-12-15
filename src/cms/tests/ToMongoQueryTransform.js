define([
	'../util/ToMongoQueryTransform',
	'intern!bdd',
	'intern/chai!assert'
], function (ToMongoQueryTransform, bdd, assert) {


	bdd.describe('ToMongoQueryTransform converts ', function () {
		var transform = new ToMongoQueryTransform();

		bdd.it(' startsWith to regex ', function () {
			var query = transform.transform({name:"ne*"});
			assert.equal(query.name.$regex, "^ne");

		});


	});
});

define([
	'../RequiredAttributes',
	'intern!bdd',
	'intern/chai!assert'
], function (RequiredAttributes, bdd, assert) {


	var schemaWithUrlString = {
		attributes: [
			{code: "url", type: "string"},
			{code: "text", type: "string"}
		]
	}

	var toModel = function(s) {
		return {
			getPlainValue: function () {
				return s;
			}
		}

	}





	bdd.describe('RequiredAttributes', function () {

		bdd.before(function () {

		});

		bdd.after(function () {

		});

		bdd.it('validate url and type', function () {
			var r = new RequiredAttributes([{code: 'url', type: 'string'}]);
			var errors = r.validate(toModel(schemaWithUrlString), true);
			assert.equal(errors.length, 0);
		});

		bdd.it('validate wrong type', function () {
			var r = RequiredAttributes([{code: 'url', type: 'number'}]);
			var errors = r.validate(toModel(schemaWithUrlString), true);
			assert.equal(errors.length, 1);
		});

		bdd.it('validate code', function () {
			var r = RequiredAttributes([{code: 'xxx'}]);
			var errors = r.validate(toModel(schemaWithUrlString), true);
			assert.equal(errors.length, 1);
		});

		bdd.it('validate no type required', function () {
			var r = RequiredAttributes([{code: 'url'}]);
			var errors = r.validate(toModel(schemaWithUrlString), true);
			assert.equal(errors.length, 0);
		});

		bdd.it('validate two required props', function () {
			var r = RequiredAttributes([{code: 'url'},{code:'text'}]);
			var errors = r.validate(toModel(schemaWithUrlString), true);
			assert.equal(errors.length, 0);
		});


	});
});

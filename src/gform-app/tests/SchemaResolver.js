define([
	'../util/SchemaResolver',
	'intern!bdd',
	'intern/chai!assert'
], function (SchemaResolver, bdd, assert) {


	bdd.describe('SchemaResolver', function () {
		var resolver;

		bdd.beforeEach(function () {
			simpleSchema = {
				attributes: [
					{
						resolve: 0
					},
					{
						dontResolve: 1
					}
				]
			}

			complexSchema = {
				attributes: [
					{
						resolve: 1
					},
					{
						dontResolve: 1
					}
				]
			}

			recursiveSchema = {
				attributes: [
					{
						resolve: 2
					},
					{
						dontResolve: 1
					}
				]
			}

			refs = [
				"the1",
				simpleSchema,
				recursiveSchema
			]

			resolver = new SchemaResolver();
			resolver.loaded=[];
			resolver.loadFromStore = function (ref,deferred) {
				this.loaded.push(ref.id);
				deferred.resolve(refs[ref.id]);
			}

			specialResolver = {
				resolve: function (obj) {
					if ("resolve" in obj) {
						return {
							store: "x", id: obj.resolve, setter: function (value) {
								obj.resolvedValue = value;
							}
						}
					}
				}
			}

			resolver.addResolver(specialResolver);
		});


		bdd.it('load ', function () {
			resolver.resolve(simpleSchema);
			assert.equal(resolver.loaded.length,1);
			assert.equal(simpleSchema.attributes[0].resolvedValue, "the1");

		});

		bdd.it('transitive ', function () {
			resolver.resolve(complexSchema);
			assert.equal(resolver.loaded.length,1);
			assert.equal(complexSchema.attributes[0].resolvedValue, simpleSchema);

		});

		bdd.it('recursiveSchema ', function () {
			resolver.resolve(recursiveSchema, {store:"x",id:2});
			assert.equal(resolver.loaded.length,0);
			assert.equal(recursiveSchema.attributes[0].resolvedValue, recursiveSchema);

		});


	});
});

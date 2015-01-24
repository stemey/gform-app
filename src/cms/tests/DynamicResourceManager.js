define([
	'dojo/_base/declare',
	'../factory/dynamic/DynamicResourceManager',
	'intern!bdd',
	'intern/chai!assert'
], function (declare, DynamicResourceManager, bdd, assert) {
	bdd.describe('dynamic resource manager', function () {
		var ctx;
		var createEditorFactory = function () {
			return {}
		};

		var StoreClass = declare(null, {
			map: null,
			constructor: function (kwArgs) {
				this.kwArgs = kwArgs;
				this.idProperty = kwArgs.idProperty;
				this.map = {};
				this.name = kwArgs.name;
			},
			promise: function (data) {
				return {
					then: function (cb) {
						cb(data);
						return this;
					},
					otherwise: function () {

					}
				}
			},
			add: function (data) {
				this.map[this.getIdentity(data)] = data;
			},
			get: function (id) {
				return this.promise(this.map[id]);
			},
			query: function () {
				return this.promise(Object.keys(this.map).map(function (key) {
					return this.map[key];
				}, this));
			},
			getIdentity: function (o) {
				return o[this.idProperty];
			}
		})

		bdd.before(function () {
			var schemaStore = new StoreClass({idProperty: "id", name: "schema"});
			var metaStore = new StoreClass({idProperty: "id", name: "meta"});

			ctx = {
				stores: {},
				schemas: {},
				schemaStores: {},
				addSchema: function (id, schema) {
					this.schemas[id] = schema;
				},
				getStore: function (id) {
					if (id == "meta") {
						return metaStore;
					} else if (id == "schema") {
						return schemaStore;
					}
				},
				addStore: function (id, store) {
					this.stores[id] = store;
				},
				removeStore: function (id) {
					delete this.stores[id];
				},
				addSchemaStore: function (id, store) {
					this.schemaStores[id] = store;
				},
				removeSchemaStore: function (id) {
					delete this.schemaStores[id];
				},
				isClean: function () {
					return Object.keys(this.stores).length == 0 && Object.keys(this.schemas).length == 0 && Object.keys(this.schemaStores).length == 0;
				}
			};
		});

		bdd.after(function () {

		});

		bdd.it('add and remove noSchema', function () {
			var config = {
				storeId: "meta",
				schemaStore: "schema",
				idProperty: "id",
				baseUrl: "/base/"
			}
			var rm = new DynamicResourceManager({
				ctx: ctx,
				config: config,
				createEditorFactory: createEditorFactory,
				StoreClass: StoreClass
			})

			rm.addMeta({name: "test", collection: "testc", id: "2", schema: null});
			assert.equal(ctx.stores["test"].kwArgs.target, "/base/testc/");
			assert.equal(ctx.stores["test"].kwArgs.idProperty, "id");

			rm.removeMeta("2");
			assert.equal(ctx.stores["test"], null);
			assert.equal(ctx.isClean(),true);
		});

		bdd.it('add and remove singleSchema', function () {
			var config = {
				storeId: "meta",
				schemaStore: "schema",
				idProperty: "id",
				baseUrl: "/base/"
			}
			var rm = new DynamicResourceManager({
				ctx: ctx,
				config: config,
				createEditorFactory: createEditorFactory,
				StoreClass: StoreClass
			})

			var schema = {id: "1111"};
			ctx.getStore("schema").add(schema);


			rm.addMeta({name: "test", collection: "testc", id: "2", schema: {schema: "1111"}});
			assert.equal(ctx.stores["test"].kwArgs.target, "/base/testc/");
			assert.equal(ctx.stores["test"].kwArgs.idProperty, "id");
			assert.equal(ctx.stores["test"].template, "schema/1111");


			rm.removeMeta("2");
			assert.equal(ctx.stores["test"], null);
			assert.equal(ctx.isClean(),true);
		});

		bdd.it('add and remove multiSchema', function () {
			var config = {
				storeId: "meta",
				schemaStore: "schema",
				idProperty: "id",
				baseUrl: "/base/"
			}
			var rm = new DynamicResourceManager({
				ctx: ctx,
				config: config,
				createEditorFactory: createEditorFactory,
				StoreClass: StoreClass
			})

			var schema = {id: "1111"};
			ctx.getStore("schema").add(schema);
			var schema2 = {id: "2222"};
			ctx.getStore("schema").add(schema);


			rm.addMeta({name: "test", collection: "testc", id: "2", schema: {typeProperty: "type", schemas: ["1111"]}});
			assert.equal(ctx.stores["test"].kwArgs.target, "/base/testc/");
			assert.equal(ctx.stores["test"].kwArgs.idProperty, "id");
			assert.equal(ctx.stores["test"].typeProperty, "type");
			assert.equal(ctx.stores["test"].templateStore, "/schema-test");
			assert.equal(ctx.schemaStores["/schema-test"].name, "/schema-test");
			ctx.schemaStores["/schema-test"].query({}).then(function (results) {
				assert.equal(results.length, 1);

			})


			rm.removeMeta("2");
			assert.equal(ctx.stores["test"], null);
			assert.equal(ctx.isClean(),true);
		});


	});
});

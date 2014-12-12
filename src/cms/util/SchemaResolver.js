define([
	"dojo/_base/Deferred",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/promise/all"

], function (Deferred, declare, lang, all) {
// module:
//		gform/util/Resolver


	return declare("cms.util.Resolver", [], {
		constructor: function (ctx) {
			this.ctx = ctx;
			this.references = [];
			this.values = [];
			this.resolvers=[];
		},
		addResolver: function(resolver) {
			this.resolvers.push(resolver);
		},
		finish: function (references) {
			// summary:
			//		external unloaded references are loaded.
			// returns: dojo/Promise
			//		returns a promise
			var deferreds = [];
			var me =this;
			references.forEach( function (ref) {
				var deferred =this.load(ref);
				deferred.then(function(value){
					me.values[me.createId(ref)]=value;
				});
				this.references.push({id:me.createId(ref),setter:ref.setter});
				deferreds.push(deferred);
			}, this);
			return all(deferreds);
		},
		resolveInternally: function (obj) {
			// summary:
			//		resolve a single property value
			// setter:
			//		if this is a ref then setter needs to be called with the resolved value
			var references = [];
			var resolved = false;
			if (!resolved && (lang.isObject(obj) || lang.isArray(obj))) {
				resolved=this.resolvers.some(function(resolver) {
					var ref = resolver.resolve(obj);
					if (ref) {
						references.push(ref);
						return true;
					}else{
						return false;
					}
				});
				if (!resolved) {
					for (var name in obj) {
						if (obj.hasOwnProperty(name)) {
							references = references.concat(this.resolveInternally(obj[name]));
						}
					}
				}
			}

			return references;
		},
		resolveMore: function (obj) {
			var references = this.resolveInternally(obj);
			return this.finish(references);
		},
		wrapUp: function (finalPromise, object) {
			this.references.forEach(function(r) {
				r.setter(this.values[r.id]);
			}, this);
			finalPromise.resolve(object);
		},
		resolve: function (object, ref) {
			if (ref) {
				this.values[this.createId(ref)] = object;
			}
			var finalPromise = new Deferred();
			var promise = this.resolveMore(object);
			promise.then(lang.hitch(this, "wrapUp", finalPromise, object));
			return finalPromise;
		},
		createId: function(ref) {
			return ref.store+"/"+ref.id;
		},
		load: function (ref) {
			var deferred = new Deferred();
			var loaded = this.values[this.createId(ref)];
			if (loaded) {
				deferred.resolve(loaded);
			}else{
				this.loadFromStore(ref, deferred);

			}
			return deferred.promise;
		},
		loadFromStore: function(ref,deferred) {
			var me = this;
			this.ctx.getStore(ref.store).get(ref.id).then(function(value) {
				var p = me.resolveMore(value);
				p.then(function() {
					deferred.resolve(value);
				});

			},function(e) {
				deferred.reject(e);
			});
		}
	});

});

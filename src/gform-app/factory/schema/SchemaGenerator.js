define([
    'gform/util/Resolver',
    'dojo/_base/Deferred',
    'dojo/_base/lang',
    'dojo/when',
    "dojo/_base/declare",
    "dojo/text!../../schema/template.json"
], function (Resolver, Deferred, lang, when,  declare, templateSchema) {

    /**
     * store to store our schemas.
     * schema that provide a meta schema for the store.
     *
     */

    return declare([], {
        deferred: null,
		schemaGenerator:null,
        create: function (ctx, config) {
            var store = ctx.getStore(config.store);
			this.schemaGenerator = config.schemaGenerator;
            //var templateToSchemaTransformer = new TemplateSchemaTransformer(store);
            //registry.pageTransformer = templateToSchemaTransformer
            //registry.templateTransformer = templateToSchemaTransformer;
            this.loadTemplateSchema(store);
            this.deferred = new Deferred();
            this.requiredAttribute=config.requiredAttribute;
            return this.deferred;

        },
        loadTemplateSchema: function (store) {
                var t = this.schemaGenerator.createTransformer();
                t.replace("gform/schema/attributes.json", "gform-app/example/cms/attributes.json");
                t.replace("gform/schema/attributes/header.json", "gform-app/meta/header.json");
                t.replace("gform/schema/group/properties/attribute.json", "gform-app/meta/group-attribute.json");
                t.replace("gform/schema/group/properties/attributes.json", "gform-app/meta/group-attributes.json");
                t.replace("gform/schema/attributes/properties/group.json", "gform-app/meta/group.json");
                t.replace("gform/schema/attributes/properties/groups.json", "gform-app/meta/groups.json");
                t.replace("gform/schema/group.json", "gform-app/factory/schema/group.json");

            var baseSchema = JSON.parse(templateSchema)


            var values = {
                pageStore:"page",
                pageIdProperty:"id",
                idProperty:"id",
                idType:"string",
                idRequired:true,
                idDisabled:false,
                templateStore:"/template",
                templateSchema:"/template",
                pageStore:"page",
                pageSearchProperty:"name",
                pageTypeProperty:"template"
            }

            // TODO variables should be global scope
            Object.keys(values).forEach(function(key) {
                values["gform/schema/"+key]=values[key];
                values["gform-app/meta/"+key]=values[key];
            })

            var promise = this.schemaGenerator.load(baseSchema, "gform/schema/", t,values);
            when(promise).then(lang.hitch(this, "onTemplateSchemaLoaded", store));
        },
        onTemplateSchemaLoaded: function (store,  meta) {
            //meta.store = "/schema";


            /*
            // adding the schema store's id attribute
            idAttribute["type"] = store.idType || "string";
            idAttribute["code"] = store.idProperty;
            idAttribute["disabled"] = true;
            baseSchema.groups[0].attributes.push(idAttribute);
            */

            /*
            //TODO migrate
            var group = meta.attributes[0];
            if (this.requiredAttribute) {
                group.requiredAttributes = [{code: this.requiredAttribute}];
            }
             */

            //baseSchema.groups[3].attributes.push(group);
            this.deferred.resolve(meta);
        }
    });


});

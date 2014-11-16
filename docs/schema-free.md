# schema-free database

The admin ui for schema-free database is usually generic and unintuitive. For A document database it is often a tree view or a simple json text editor.
Gform makes it possible to add a schema and ui that can be changed at runtime, supports validation and context help (tooltips etc.). This schema is 
allows for dynamic extension, so that extra information not present in the schema may be added.

## store setup

Gform needs two stores (in the case of mongodb this means two collections) to manage its metadata.
One store is for defining new stores and the other two define schemas. 

### schema store

The schema store stores gform schemas. 


````
	{
		"name":"mySchema",
		"group":{
			"attributes":[
				{
					....
				}
			]
		}
	}
````

Here is an example store configuration:

````json
	{
		"factoryId": "cms/factory/StoreFactory",
		"name": "/mdbschema",
		"storeClass": "cms/util/MongoRest",
		"idProperty": "_id",
		"idType": "string",
		"target": "http://localhost:3000/collection/mdbschema/",
		"template": "/mdbschema",
		"createEditorFactory": "cms/createBuilderEditorFactory"
	}
```

`template`refers to the gform schema.


### metadata store

The metadata store contains information about stores. Stores can be modified at runtime. They contain the mapping to the underlying server and also the schema data.
A store can have a single schema or many schemas.
 
example for single-schema`:

````
	{
		"name":"myCollection",
		"collection":"myCollection",
		"schema":{
			"schemaType":"single-schema",
			"schema":"1"
		}
	}
````

* `collection` is the name of the underlying mongodb collection
* `schema`is of type `single-schema`and references the schema's id by the value of `schema.schema`.  

example for `multi-schema:

````
	{
		"name":"myCollection",
		"collection":"myCollection",
		"schema":{
			"schemaType":"multi-schema",
			"typeProperty":"",
			"schemas":["1","2"]
		}
	}
````

* `collection` is the name of the underlying mongodb collection
* `schema`is of type `multi-schema`and references the schemas' ids by the value of `schema.schemas`.  
* `schema.typeProperty` is the property that defines an entity's schema by its id.

Each schema needs to have the correct idProperty and in case of multi-schema the correct typeProperty.

Here is an example store configuration:

````json
	{
		"factoryId": "cms/factory/StoreFactory",
		"name": "/mdbcollection",
		"storeClass": "cms/util/MongoRest",
		"idProperty": "_id",
		"idType": "string",
		"target": "http://localhost:3000/collection/mdbcollection/",
		"template": "/mdbcollection",
		"createEditorFactory": "cms/createBuilderEditorFactory"
	}
````

## static schema configuration

The two mentioned schemas for the metadata and schema stores are configured as follows:

````json
	{
		"schemaRegistry": {
			"factoryId": "cms/factory/schema/SchemaRegistryFactory",
			"registryClass": "cms/SchemaRegistry",
			"stores": ["/mdbschema"],
			"schemaGenerators": [
				{
					"factoryId": "cms/factory/schema/MdbSchemaGenerator",
					"store": "/mdbschema" 
				},
				{
					"factoryId": "cms/factory/schema/StaticSchemaGenerator",
					"module": "cms/schema/mdbcollection.json" 
				}
			]
		}
	}
```

The first schemaGenerator generates a schema and registers it under the store's name ("/mdbschema"). That is the meta model for all schemas 
created via the ui.

The second schemaGenerator uses a static schema.json and adds it under the schema's id to the registry.

The schemas created in the ui are loaded from the store "/mdbschema". The schemas' names follow this pattern: "/mdbschema/{name}".
For the schemaRegistry to correctly resole the schema it will look for a store with the nae "/mdbschema" and use the second part of the name as an id
to lookup the schema.
 


## dynamic stores

So far the setup for the two static stores and their schemas were explained. The dynamic stores are managed by a `DynamicResourceFactory`.
It will update the storeRegistry and schemaRegistry.


````
	"resourceFactories": [
		{
			"factoryId": "cms/factory/DynamicResourceFactory",
			"storeClass": "cms/util/MongoRest",
			"baseUrl": "http://localhost:3000/collection/",
			"storeId": "/mdbcollection",
			"schemaStore":"/mdbschema",
			"idProperty":"_id"
		}
	]

This resourceFactory adds MongoDb stores with the url "http://localhost:3000/collection/{storeId}". 


## view setup



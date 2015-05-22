domain
======

The domain model consists of entities, types and stores. Sometimes types are also called templates or schemas.

###entity
entities are usually json documents. An entity must have a unique id which can be accessed via a single top level property.
An entity may have a typeProperty which holds the type discriminator. The discriminator is associated with a schema and
is used to generate an appropriate master and detail view to browse and edit the entity.

###store
Store is an abstraction to access entities. Stores have a simple api and can be used access data from different systems:
browser stores like IndexDB, LocalStorage or server side stores providing access via rest.


A store provides functions to create, update, read and delete entities. Stores use promises as return values for
asynchronuos access but fallback to simple valus for synchronuos access.

#### Read a single entity by id
Deading a single entity by its id is done via `store.get(id)`. The implementation is pretty straight forward and the
result is the entity itself.

####Delete a single entity by id
Deleting a single entity is done via `store.delete(id)`. The return value is unimportant.

####Update a single entity
Updating is done via `store.put(entity)`. The id is taken from the entity. The return value is usually not important.
Their are cases where version information or similar things are updated in the entity as well. This change is currently not
visible after saving an updated entity.

#### Create an entity
Creating an entity is done via `store.add(entity)`. The return value is either the generated id or the updated entity. In either case
the entity is reloaded to reflect all changes.

###Query entities
This is the function that needs the most work when connecting to a new data store. The function is `store.query(query,options`.
See documentation on parameter [here](dojotoolkit.org). The dojo store abstraction is not perfect in this regard. Usually
there are two kinds of queries that the store implementor needs to take into consideration. One is issued by `dijit/FilteringSelet`
and the other by `gridx/Grid`.

####types
Entities in a store may either all have the same type or they can have individual types. In the former case the store has a proeprty 'template'
which is the id of the schema that all entities conform to. In the latter case each entity has a type property which
contains the id of the schema. The name of the property is `store.typeProperty`.

####tree
A store can contain a tree of entities (See [here](dojotoolkit.org)). There are two ways to implement this behavior in gform-app.
Either all entities except the root have a parent identified by its id. The store needs to provide a `parentProperty`.



####


An entity is usually a json document which is accessed via a store. A store provides access to entities via http or it serves them from a browser storage.
Stores are an extension of `dojo/store`. They also provide access to the entities types. All entities have a type. The type is a gform schema. The schema is either the same 
for all entities in a store. Alternatively the entities provide a certain property called type property which serves as a type discriminator.

## AppContext

The app's global state is managed by `gform/AppContext`:

properties:
* storeId: the currently selected store. Each store is associated with a customer view.
* schemaRegistry: global registry for schemas 
* storeRegistry:global registry for stores

All components have access to the AppContext during initialization.

## store

stores have the following properties and methods (in addition to the ones defined by `dojo/store`):

* name: the store identifier
* typeProperty?: the property which holds the type discriminator
* templateStore?: provides the schemas for this store 
* template?: if all entities have the same type this is the type discriminator
* editorFactory: defines the binding of schemas and its attributes to widgets. Also defines actions like "save", "delete", "discard" that are displayed in the detail editor.
* assignableId: whether or not the user may initially set the id
* idProperty: the name of the property that holds the primary key - inherited from 'dojo/store'.
* idType: the type of the idProperty. Used to generate a default schema for a store.

To get the actual store implementation from the store's name:

	// require dojo/when
    var store = appContext.getStore("/users");
    when(store.get(123)).then(function(user) {...};

Either the store has a template property or both a typeProperty and the templateStore property.

## schema

A schema defines the attributes (properties) a json document may have. These schemas are usually gform schema documents that are perfect to create
a form to edit its instances. Schemas can allow additional dynamic properties that are not restricted by the schema.

To programmatically get hold of a schema:

	// require dojo/when
    when(appContext.getSchema("mySchema")).then(function(schema) {
    	//
    })


Schemas can either be defined as simple json files, linked json files, accessed via a store or they are created by the user in the gform-app.

### simple json files

    {
      "editor":"listpane",
      "attributes":[
         {
            "code":"name",
            "type":"string",
            "editor":"richtext"
         }
      ]
    }
    
Register the schema:

    appContext.addSchema("mySchema",schema);

### linked json files

    {
      "attributes":[
         {
            "code":"embedded",
            "type":"object",
            "group":{"$ref":"./embedded-schemas.json}
         }
      ]
    }
    
Compile and register schema:
   
    // require 'gform/util/Resolver'
    var resolver = new Resolver();
    var schemaPromise = resolver.resolve(schema, config.module);
    schemaPromise.then(function () {
      // schema is modified
      deferred.resolve(schema);
    })
 
### store
 
 There may be more than one schema store. Each store has a name and the schemas are identified by a url `<storeName>/<schemaId>`.
 
    var promise = appContext.getSchema("mySchemas/schema1");

    
### gform schema editor

The gform schema editor is generated itself by a complex linked json schema. It provides good separation of layout and schema 
editing.
TBD

## entity

an entity has a property that contains a unique id. This id needs to be unique across a store. Entities that are contained in a multi-type store
also have a type property. The typeProperty and the idProperty are provided by the store.


To retrieve an entity's type there are two ways:

1. All entities in the store have the same type.
`store.template`is the id of the schema. To retrieve it use `schemaRegistry.get(id)`.

2. The store contains entities of different types.

An entities type is defined by its typeProperty. The name of the typeProperty is retrieved from `store.typeProperty`.
To retrieve the the schema from the schemaRegistry you need to prefix the typeProperty's value with `store.templateStore`.

    var promise = appContext.getSchema(store.templateStore+"/"+entity[store.typeProperty];
    // equivalent to
    var promise = appContext.getStore(store.templateStore).get(entity[store.typeProperty])




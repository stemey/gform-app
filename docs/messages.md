# messages
========


The components in cms4apps communicate via dojo/topic messages.


## known messages


persistent entity is described by: store, id
transient entity is described by: templateUrl, store

Messages:

storeName can be retrieved from store.name

* /new: {storeName, templateUrl}
* /focus: { storeName,id:'id of the entity',  template?} an entity was selected.
* /added: {storeName, id} an entity was saved.
* /deleted: {storeName, id, entity} an entity was deleted.
* /updated: {storeName, id ,newEntity, oldEntity? } an entity was updated.


store:
 - name
 - templateStore: name of the template strore
 - typeProperty: only if templateStore is given
 - template: name of the template (instead of templateSTore
 - idProperty: name of the id property
 - idType: type of the id property. can be used to create the schema
 - createEditorFactory: the modeule id of the function to create the editorFactory
 - instanceStore?: if this is a template store, then this is the name of the instance store
 - plainValueFactory?: moduleId of the function to create default objects



General tasks:

A. get schema for entity:

1. store.template!=null
store.template is the name of the schema. Retrieve via schemaRegistry.get(store.template)

2. store.template==null

var template = entity[store.typeProperty];
var schema = schemaRegistry.get(template);


B. get schema for new instance

either use store.template or search a template :
storeRegistry.get(store.templateStore).query({name:"myt?"});

C.

- template:
    1. get entity, use template property to get template
    2. get template from store
- schemaUrl:
    use template-id and schemaStore name to create schemaUrl (schemaUrl = /<store>/id)


store:
- name
- templateUrl?
- templateStore? (needs to be prepended to templateId from entity)

schemaRegistry
- getStore(templateUrl): when creating new entity.


resourceRegistry

- getSchemaUrlByIdAndStore (id,store): either return schemaUrl from store or load entity and return that way.

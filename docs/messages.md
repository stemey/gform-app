# messages
========


The components in cms4apps communicate via dojo/topic messages.


## known messages

* /new: {url:'the store', schemaUrl: 'the schema of the new entity'} a new entity is to be created.
* /page/focus: {id:'id of the entity', template: 'the name of the focused entity's template'} an entity was selected.
* /page/added: {url: 'url of entity'} an entity was saved.
* /page/deleted: {entity: 'the entity deleted'} an entity was deleted.
* /page/updated: {entity: 'the updated entity'} an entity was updated.
* /template/focus: {id: 'id of template'} a template was focused.


persistent entity is described by: store, id
transient entity is described by: entity or template, store

Note: A template should be associated with a store.

New messages:

storeName can be retrieved from store.name

* /new: {storeName, templateUrl}
* /focus: { storeName,id:'id of the entity',  template?} an entity was selected.
* /added: {storeName, id} an entity was saved.
* /deleted: {storeName, id, entity} an entity was deleted.
* /updated: {storeName ,id ,newEntity, oldEntity? } an entity was updated.


store: store name
id: id

How to get:
you have id, store

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

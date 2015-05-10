messages
============


The loosely coupled components in gform-app communicate via `dojo/topic` messages.


### entity

these messages handle entities.

* /focus: {storeName,id, source, template} an entity was selected (e.g. in a grid or in a detail tab container).
* /new: {storeName, schemaUrl, source, value}: open an editor for a new entity (e.g. a toolbar button publishes this event to open a new editor)
* /deleted: {storeName, id, entity?, source } an entity was deleted.
* /updated: {storeName, id ,entity?, oldEntity?,  source} an entity was updated.
* /added: {storeName, id , entity, source} an new entity was persisted.
* /modify/update: {storeName, id, value} an entity was changed but its changes are not persisted yet. This event is used by peviewers to display the transient state.
* /modify/cancel: {storeName, id } an entity's editing session was cancelled.


### store

these messages handle stores.

* /store/focus: {store, source} a store was selected.
* /store/new: {store, source} a new stored was persisted.
* /store/deleted: {store, entity, source } a store was deleted.
* /store/updated: {store, entity?, oldEntity?, source} a store was updated.


###view

these messages handle views

* /view/new
* /view/updated
* /view/deleted


## examples

### create a new entity
The toolbar button publishes a `/new` event. The `TabOpener` is subscribed to the message and creates a new tab with 
 a corresponding editor.
 
 
### select an entity
 
The grid and Tab components publish `focus` events when a new entity is selected/focussed. They are also subscribed to 
 the message. The Tab Opener opens an editor while the Grid component displays the master view corresponding to the currently selected entity. 

### live preview

A previewer can be used to display a view for an entity that is being modified. One example is an entity that is a gform schema itself. The schemaPreviewer which 
displays the editor described by the gform schema. Another example is a entity that has an associated handlebars template.
The Previewer will render the template with the entity as the input data. 
To provide an update to the rendered view based while the user changes the entity but beofre it is saved the previwer listens to `/modify/update`
messages. 


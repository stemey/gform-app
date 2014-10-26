# messages
========


The components in gform-app communicate via dojo/topic messages.



Messages:


* /new: {storeName, templateUrl, source}
* /focus: {storeName,id} an entity was selected.
* /added: {storeName, id} an entity was saved.
* /deleted: {storeName, id, entity} an entity was deleted.
* /updated: {storeName, id ,newEntity, oldEntity? } an entity was updated.
* /modify/update: {storeName, id ,newEntity, oldEntity? } an entity was changed but its changes are not persisted yet.
* /modify/cancel: {storeName, id } an entity's editing session was cancelled.



opener:
- when tab is opened with new entity, then saving, then opening again, a new tab is opened because id has changed.

template editor:

add url 
remove "_type"
add groups that lazily create subforms for constraints.
make code be the laelAttribute

ref editor:

if no schemaUrl then don't show add/edit buttons
we need to add extra parameter to filter on pages (like template). 

performance:
-lazy form creation:
-- titlepane
-- many type widget


hooks for editor:
- initialize entity befre creation/loading and add them when getPlainValue is called.

Store:

- Memory needs to set id on objects - or rather load entity from result on persist. For a real store the id will be set there (and maybe more props )

saving props that schema does not define:

- we need to save the props that the editor does nt define


opener:
- add ActionClasses, CrudControllerClass 

textfields:

- value change after  keyup not blur


----------------------------------------------



type:string|number|integer|boolean|object|map|multiobject|ref|array

editor:{
	type:"richtext",
  elements:[],
}



type includes validation and editor the ui stuff

string: required, pattern, minlength, maxlength, group(?)

group: groupType,...

object: attributes (is the default group)

multiobject: groups

array: items: group

multiarray: items: groups

groups are a way to group attributes in a type. a group defines a type when necessary.


A group has a groupType: default, tab, titlepane(decorator), lisgroup container for other groups

ref:

validation:

- schemaUrl(s): must be of a certain type. array of types / type refs. 
- type property
- searchUrl (=url): defines where the object is saved. also needs to filter type property into based on provided schemaUrls' id/url??????
- 



if handles is missing then user:

- type and editorId??

there are default editorIds (editorId=type) 

make sure that (type,editor.id) is unique

Schema:

// returns with all validation and all editors
SchemaFactory.getAttributeSchema(type)
// returns single editor without validation
SchemaFactory.getEditorSchema(editor)

create editorFactory.js
attributes:[
	{object,class: "ObjectFactory", props:{}},
]
groups:[
	{class: "ListPaneFactory", props:{}},
]

add schemaFactory.js, that defines schemas for all types, editors
{
	validations:{
		string:[]
	},
	editors:{
		richtext:
	},
	groups:{
		tab
	}
}

Schemafactory.getValidation(type)
Schemafactory.getEditors(type)
Schemafactory.getGroups()

if type string and values is specified, then Select will be rendered. If you want to choose it, then you need to use type string and editor "select". SUCKS













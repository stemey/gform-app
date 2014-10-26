# UI


The ui is configured via json. This makes it easy to assemble an application without dojo experience.
The json structure is identical to the resulting widget hierachy. Each widget is created by a Factory that takes a set of properties and maybe children.
The root widget is a borderContainer that supports children with different regions (top, left, right, center).

The following example creates a toolbar on top. A Preview in the center. The form for editing data on the right and views to browse entities and types on the left.
```json

            {
                    "factoryId": "cms/factory/ToolbarFactory", // creates a toolbar on top
                    "region": "top",
                    "children": [..]
                },
                {
                    "factoryId": "cms/factory/TabFactory", // create a tabContainer providing trees and grids to browse entities
                    "region": "left",
                    "splitter": true,
                    "width":"250px",
                    "children": [..]
                },
                {
                    "factoryId": "cms/factory/PreviewerFactory", // creates the previewer
                    "region": "center",
                    "splitter": true
                },
                {
                    "factoryId": "cms/factory/TabOpenerFactory", // creates the forms to edit entities. multiple forms can be opened in parallel.
                    "width": "40%",
                    "region": "right",
                    "splitter": true
                }
            }

```


## Toolbar

The following tools are available in the Toolbar.

### Search for entities

This tool consists of an autocomplete input field and a button. The button will open the selected entity.

    {
        "factoryId": "cms/factory/FindPageFactory",
        "storeId": "/page",  // the store to search in
        "label": "open", // label of the button
        "searchProperty":"url", // input is matched against the beginning of this property's values.
        "labelProperty":"url",  // the property to display (if left blank is identical to searchProperty
        "placeHolder":"find page .." // the placeHolder in the input field
     }

### Create new entity

To create a new entity you must specify the entity store. If the entity store contains entities of a single type only, then a simple button
will be displayed:

    {
        "factoryId": "cms/factory/CreateFactory",
        "storeId": "/page",
        "label": "add entity"
    }

If the entity store contains entities of different types, then an autocomplete field to search for a type will be displayed:

    {
        "factoryId": "cms/factory/CreateFactory",
        "storeId": "/page", // store.templateSTore is the id of teh template store.
        "label": "+",
        "searchProperty": "name", // searchProperty in the template store
        "placeHolder": "find template .."
    }

### Create new template

This is done just like "creating a new entity".


## Edit and create Entities

Entities (which includes templates and types as well) are usually opened in a tab container. That makes it possible to have multiple open editor at a time.

It listens to the messages "/focus" and "/create".

    {
        "factoryId": "cms/factory/TabOpenerFactory"
    }

The actions that are available in the editor are defined in the EditorFactory.


## Preview Entities

An entity can be associated with a template. To preview the rendered entity. There is currently one Previewer for Handlebars. It listens to
the messages "/create", "/focus", "/modify/update", "/modify/cancel".

    {
        "factoryId": "cms/factory/PreviewerFactory",
        "rendererClass": "cms/preview/handlebars/Renderer",
        "pageStore": "/page"
    }


## Treeview

To create a tree view the store needs to provide a query with parameter `parent` returning the children.


    {
        "factoryId": "cms/factory/TreeFactory",
        "title": "tree",  // to display in a tab container
        "storeId": "/pagetree", // store id
        "labelAttribute": "name" // property to display
    }

## Grid

To create a grid view the store needs to provide a query with parameter `parent` returning the children.


    {
        "factoryId": "cms/factory/GridFactory",
        "title": "template", // for diplay in tab container
        "storeId": "/template",
        "columns": [  // columns of the grid
                    {
                        "id": "name",
                        "field": "name",
                        "name": "name"
                    }
                   ]
    }

## General layout container

## border container

The root container is a borderContainer Its children must support the `region` property. Children may provide `width` and `height` properties. Also
the boolean property`splitter` can be set to make the border be draggable.

## tab container

The tab container displays only one child at a time. Each child must provide a title property to display at the top.


    {
        "factoryId": "cms/factory/TabFactory",
        "children": [..]
     }


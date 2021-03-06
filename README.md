gform-app
========

 A framework to rapidly create administrative uis such as database clients or cms.
 Supports creation of master and detail views based on schemas. Also supports
 creation of schemas in the ui, which is the essential ingredient to create a cms.
 
applications built with gfom-app
--------
 
**mongomat**

An admin ui for mongodb ([More](http://github.com/stemey/mongomat))
This is an example of the dynamic resources approach. Stores and schemas can be created and modified at runtime.

 
**mongoose admin example**

An example of how to create an admin ui for [mongoose](http://mongoosejs.com/) ([More](http://github.com/stemey/mongoose-administration-example)).
This is an example of the static resources approach. All stores and schemas are defined externally and do not
change.


examples
---------

The following examples use localstorage to persist data. Check them out in the browser

**[static](http://toobop.net/gform-app/static.html)**

A simple example a single store with a single static schema:


**[cms4apps](http://toobop.net/gform-app/cms.html)**

A cms that uses handlebars for rendering.

An example of a single store with its documents forming a tree structure. Documents are individually associated to schemas
by a discriminator property. Each schema has a template. The gui provides a tree view, a preview and a details editor. 

The cms does not provide a way to statically generate the site or dynamically serve it either. It is up to the developer to write an application
that uses the content and templates from the cms. Usually applications use extra logic and more data sources to render 
the pages. This extra information can be mocked in the cms using extra data. For example the login information of the current
user are replaced by static mock data in the cms.


**[dynamic](http://toobop.net/gform-app/dynamic.html)**

An example of a dynamic resource factory, which provides a way to dynamically create new schemas and stores.



installation
------------

```sh
git clone www.github.com/stemey/gform-app
cd gform-app
bower install
```

open browser to load examples: /src/gform-app/examples/?.html

to optimize te javascript:

```sh
npm install
grunt build
```

open browser to load examples: /dist/gform-app/examples/?.html


Test
----

```
grunt test
```

open in browser: /node_modules/intern/client.html?config=src/gform-app/tests/intern


Documentation
-------------

- [domain](docs/domain.md) explains the basic concepts.
- [messages](docs/messages.md) explains the messages that the loosely coupled components use to communicate.
- [configuration](docs/configuration.md) explains how to configure an application from the basic building blockes.








  




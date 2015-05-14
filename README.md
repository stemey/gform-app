gform-app
========

 A framework to rapidly create admin uis. 
 
examples
--------
 
**mongomat:**

An admin ui for mongodb: (More)[github.com/stemey/mongomat]. 
 
 
VIDEO


**cms4apps**

A cms using handlebars as templates. Content and data is stored in mongodb or jcr-repository. 
Create schemas and associated templates. Manage instances in a tree structure.

VIDEO


installation
------------

* git clone github.com/stemey/gform-app
* cd gform-app
* bower install
* run the examples

to optimize js:

* npm install
* grunt build

Start the example apps mongodb.html or cms-jcr.html in the folder src or dist. Prerequisite is a running server 
that provides the data and schema.


architecture
-------------

The app is a single page app. The html page provides the configuration (examples located in src/gform-app/config). The configuration includes:


- stores to access data in server side or in-browser stores. 
- schemas to generate uis. These can be stored in stores or provided as static json files
- views which are generated from schemas and additional configuration.








  




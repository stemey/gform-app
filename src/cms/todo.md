
gform:
 default
 +improve transform: attributes.json:no-code:filter-primitives

cms
 +links to pages
 reorganize form tab: url is editable. the others are hidden or added later. merge the default array and the others. Also support groups.
 use mongodb as backend.
 page vs partial
 tree for pages
 list of references to page or template





when loading a schema the schema needs to be transformed.

load an entity. then load schema for entity: then transform schema before using it:

add a transformSchema to _CrudMixin. where to find the transfor schema: use information from template itself



{
    "schema":"template-schema",
}

ctx.transformSchema(schema);




define([], function () {
	return function () {
		return {
			group: {
				attributes: [
					{
						"editor": "string",
						"code": "_id",
						"label":"id",
						"description":"the primary key",
						"type": "string",
						"disabled": true
					},
					{
						"editor": "ref",
						"code": "type",
						"description":"Holds a reference to the entity's schema./n Necessary for collections with multiple schemas.",
						"type": "ref",
						"schemaUrl": "/mdbschema",
						"url": "/mdbschema",
						"disabled": true
					}
				]
			}
		}
	}
});

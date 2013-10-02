

render a partial

{{{ teaser. }}}


iterate over all referenced pages and render them, then make them available.

iterate over the content. replace all refs to pages (url starts with /page/ or schema defines that ef is a page????) with a function tht renders the page.


we need to have the schema define the referenced type: schemaUrl is very narrow. schemaUrlPattern(or -Prefix) /page


inclusion of templates:

1. static template

ref page

{{# teaser.teaserA }}
{{> teaserA }} // tempalte should really be defined by teaserA.template
{{/ teaserA.teaserA }}
{{# teaser.teaserB }}
{{> teaserB }} // tempalte should really be defined by teaserA.template
{{/ teaser.teaserB }}

--> 
1. include teaserA data in main data
2. add templateName to list of partials.

reference data: 
{
	template:{
			teaserA: false,
			teaserB:true	
	}
	....
}


2. dynamic template (DOES NOT WORK)

ref page

{{# teaserA }}
{{> ????? }}
{{/ teaserA }}

3. dynamic content include

{{teaserA}}

refContent

extra property in attribute needed:
usage=content | url




define([
	'../preview/handlebars/Renderer',
	'./when',
    './MemoryStore',
    'intern!bdd',
    'intern/chai!assert'
], function (Renderer, when, MemoryStore, bdd, assert) {
    bdd.describe('Renderer', function () {
        var renderer;

        bdd.before(function () {
            renderer = new Renderer();
            renderer.templateStore = new MemoryStore();
            renderer.templateStore.add("/template/t1.html", {
                sourceCode: "<title>{{title}}</title>",
                attributes: [
                    {code: "title", type: "string", partial: true}
                ]
            });
            renderer.templateStore.add("/template/t2.html", {
                sourceCode: "<body>{{{content}}}</body>",
                attributes: [
                    {code: "content", type: "ref"}
                ]
            });
            renderer.templateStore.add("/template/t3.html", {
                sourceCode: "<p>{{text}}</p>",
                attributes: [
                    {code: "text", type: "string"}
                ]
            });
            renderer.templateStore.add("/template/partial.html", {
                sourceCode: "<body>{{#partial}}{{>partial}}{{/partial}}</body>",
                attributes: [
                    {code: "partial", type: "ref", usage: "partial"}
                ]
            });
            renderer.templateStore.add("/template/link.html", {
                sourceCode: "<a href='{{page}}'></a>",
                attributes: [
                    {code: "page", type: "ref", usage: "link"}
                ]
            });
            renderer.templateStore.add("/template/complex.html", {
                sourceCode: "<p>{{complex.text}}</p>",
                attributes: [
                    {code: "complex", validTypes: [
                        {attributes: [
                            {code: "text", type: "string"}
                        ]}
                    ]}
                ]
            });
            renderer.templateStore.add("/template/list.html", {
                sourceCode: "{{#list}}{{{.}}},{{/list}}",
                attributes: [
                    {code: "list", type: "array", element: {type: "string"}}
                ]
            });
            renderer.templateStore.add("/template/partiallist.html", {
                sourceCode: "{{#list}}{{#x}}{{>x}}{{/x}}{{/list}}",
                attributes: [
                    {code: "list", type: "array", group: {type: "object", attributes: [
                        {code: "x", type: "ref", usage: "partial"}
                    ]}}
                ]
            });
            renderer.templateStore.add("/template/pageList.html", {
                sourceCode: "{{#list}}{{{.}}},{{/list}}",
                attributes: [
                    {code: "list", type: "array", element: {type: "ref", "usage": "html"}}
                ]
            });
            var outer = {
                sourceCode: "<html>{{#inner}}{{>inner}}{{/inner}}</html>",
                group: {
                    attributes: []
                }
            };
            renderer.templateStore.add("/template/inner.html", {
                sourceCode: "-{{title}}-",
                attributes: [
                    {code: "outer", editor: "template-ref", outer: true, template: outer},
                    {code: "title", type: "string"}
                ]
            });
            var outerWithPartials = {
                sourceCode: "<html>{{{partial}}}{{#inner}}{{>inner}}{{/inner}}</html>",
                group: {
                    attributes: []
                },
                partials:{
                    partial:"p1.html"
                }

            };
            renderer.templateStore.add("/template/innerWithPartials.html", {
                sourceCode: "--",
                attributes: [
                    {code: "outer", editor: "template-ref", outer: true, template: outerWithPartials},
                    {code: "title", type: "string"}
                ]
            });
            var outerWithPartialTemplate = {
                sourceCode: "<html>{{#partial}}{{>partial}}{{/partial}}{{#inner}}{{>inner}}{{/inner}}</html>",
                group: {
                    attributes: []
                },
                partialTemplates:{
                    partial:renderer.templateStore.findByUrl("/template/t1.html")
                }

            };
            renderer.templateStore.add("/template/innerWithPartialTemplate.html", {
                sourceCode: "--",
                attributes: [
                    {code: "outer", editor: "template-ref", outer: true, template: outerWithPartialTemplate},
                    {code: "title", type: "string"}
                ]
            });
            renderer.pageStore = new MemoryStore();
            renderer.pageStore.add("/page/p1.html", {template: "t1.html", title: "hello", url: "p1.html"});
            renderer.pageStore.add("/page/link.html", {template: "link.html", page: "/page/p1.html"});
            renderer.pageStore.add("/page/p2.html", {template: "t2.html", content: "/page/teaser.html"});
            renderer.pageStore.add("/page/teaser.html", {template: "t3.html", text: "hello world"});
            renderer.pageStore.add("/page/teaser2.html", {template: "t3.html", text: "bye world"});
            renderer.pageStore.add("/page/complex.html", {template: "complex.html", complex: {text: "hello"}});
            renderer.pageStore.add("/page/partial.html", {template: "partial.html", partial: "/page/teaser.html"});
            renderer.pageStore.add("/page/list.html", {template: "list.html", list: ["hello", "bye"]});
            renderer.pageStore.add("/page/pageList.html", {template: "pageList.html", list: [
                "/page/teaser.html",
                "/page/teaser2.html"
            ]});
            renderer.pageStore.add("/page/partiallist.html", {template: "partiallist.html", list: [
                {x: "/page/teaser.html"},
                {x: "/page/teaser2.html"}
            ]});
            renderer.pageStore.add("/page/inner.html", {template: "inner.html", outer: {}, title: "hello"});
            renderer.pageStore.add("/page/innerWithPartials.html", {template: "innerWithPartials.html", outer: {}});
            renderer.pageStore.add("/page/innerWithPartialTemplate.html", {template: "innerWithPartialTemplate.html", outer: {partial:{title: "hello"}}});
        });

        bdd.after(function () {

        });

        bdd.it('page1 should render "hello"', function () {
            return when(renderer.render("/page/p1.html"), function (result) {
                assert.equal(result[0].html, "<title>hello</title>");
            });

        });

        bdd.it('page2 should render content of page 1', function () {
            return when(renderer.render("/page/p2.html"), function (result) {
                assert.equal(result[0].html, "<body><p>hello world</p></body>");
            });
        });

        bdd.it('page should render url of other page', function () {
            return when(renderer.render("/page/link.html"), function (result) {
                assert.equal(result[0].html, "<a href='p1.html'></a>");
            });
        });

        bdd.it('page should render complex content', function () {
            return when(renderer.render("/page/complex.html"), function (result) {
                assert.equal(result[0].html, "<p>hello</p>");
            });
        });

        bdd.it('page should render partial', function () {
            return when(renderer.render("/page/partial.html"), function (result) {
                assert.equal(result[0].html, "<body><p>hello world</p></body>");
            });
        });

        bdd.it('page should render array of partial', function () {
            return when(renderer.render("/page/partiallist.html"), function (result) {
                assert.equal(result[0].html, "<p>hello world</p><p>bye world</p>");
            });
        });

        bdd.it('page should render array of text', function () {
            return when(renderer.render("/page/list.html"), function (result) {
                assert.equal(result[0].html, "hello,bye,");
            });
        });

        bdd.it('page should render array of content', function () {
            return when(renderer.render("/page/pageList.html"), function (result) {
                assert.equal(result[0].html, "<p>hello world</p>,<p>bye world</p>,");
            });
        });

        bdd.it('page should render outer template ref', function () {
            return when(renderer.render("/page/inner.html"), function (result) {
                assert.equal(result[0].html, "<html>-hello-</html>");
            });
        });

        bdd.it('page should render outer template ref. outer has partials', function () {
            return when(renderer.render("/page/innerWithPartials.html"), function (result) {
                assert.equal(result[0].html, "<html><title>hello</title>--</html>");
            });
        });

        bdd.it('page should render outer template ref. outer has partial template', function () {
            return when(renderer.render("/page/innerWithPartialTemplate.html"), function (result) {
                assert.equal(result[0].html, "<html><title>hello</title>--</html>");
            });
        });


    });
});

define([
    './when',
    './MemoryStore',
    'intern!bdd',
    'intern/chai!assert',
    '../preview/mustache/Renderer'
], function (when, MemoryStore, bdd, assert, Renderer) {
    bdd.describe('demo widget', function () {
        var renderer;

        bdd.before(function () {
            renderer = new Renderer();
            renderer.templateStore = new MemoryStore();
            renderer.templateStore.add("/template/t1.html", {
                code: "<title>{{title}}</title>",
                attributes:[
                    {code: "title", type: "string", partial:true}
                ]
            });
            renderer.templateStore.add("/template/t2.html", {
                code: "<body>{{{content}}}</body>",
                attributes:[
                    {code: "content", type: "ref"}
                ]
            });
            renderer.templateStore.add("/template/t3.html", {
                code: "<p>{{text}}</p>",
                attributes:[
                    {code: "text", type: "string"}
                ]
            });
            renderer.templateStore.add("/template/complex.html", {
                code: "<p>{{complex.text}}</p>",
                attributes:[
                    {code: "complex", validTypes: [{attributes:[{code:"text", type:"string"}]}]}
                ]
            });
            renderer.templateStore.add("/template/list.html", {
                code: "{{#list}}{{{.}}},{{/list}}",
                attributes:[
                    {code: "list",  type:"array", element:{type:"string"}}
                ]
            });
            renderer.templateStore.add("/template/pageList.html", {
                code: "{{#list}}{{{.}}},{{/list}}",
                attributes:[
                    {code: "list", type:"array", element:{type:"ref"}}
                ]
            });
            renderer.pageStore = new MemoryStore();
            renderer.pageStore.add("/page/p1.html", {template: "/template/t1.html", title: "hello"});
            renderer.pageStore.add("/page/p2.html", {template: "/template/t2.html", content: {$ref:"/page/teaser.html"}});
            renderer.pageStore.add("/page/teaser.html", {template: "/template/t3.html", text: "hello world"});
            renderer.pageStore.add("/page/teaser2.html", {template: "/template/t3.html", text: "bye world"});
            renderer.pageStore.add("/page/complex.html", {template: "/template/complex.html", complex: {text:"hello"}});
            renderer.pageStore.add("/page/list.html", {template: "/template/list.html", list: ["hello","bye"]});
            renderer.pageStore.add("/page/pageList.html", {template: "/template/pageList.html", list: [{"$ref":"/page/teaser.html"},{"$ref":"/page/teaser2.html"}]});
        });

        bdd.after(function () {

        });

        bdd.it('page1 should render "hello"', function () {
            return when(renderer.render("/page/p1.html"), function(result) {
                assert.equal(result[0],"<title>hello</title>");
            });

        });

        bdd.it('page2 should render content of page 1', function () {
            return when(renderer.render("/page/p2.html"), function(result) {
                assert.equal(result[0],"<body><p>hello world</p></body>");
            });
        });

        bdd.it('page should render complex content', function () {
            return when(renderer.render("/page/complex.html"), function(result) {
                assert.equal(result[0],"<p>hello</p>");
            });
        });

        bdd.it('page should render array of text', function () {
            return when(renderer.render("/page/list.html"), function(result) {
                assert.equal(result[0],"hello,bye,");
            });
        });

        bdd.it('page should render array of content', function () {
            return when(renderer.render("/page/pageList.html"), function(result) {
                assert.equal(result[0],"<p>hello world</p>,<p>bye world</p>,");
            });
        });


    });
});
define(["doh/runner","minicms/preview/mustache/Renderer", "mustachejs/mustache", "./MemoryStore", "dojo/when"], function(doh,Renderer, mustache, MemoryStore, when){

		var renderer = new Renderer();
		renderer.renderer=mustache;
		renderer.templateStore = new MemoryStore();
		renderer.templateStore.add("/template/t1.html", {
			code: "<title>{{title}}</title>", 
			attributes:[
				{code: "title", type: "string"}
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
		renderer.pageStore = new MemoryStore();
		renderer.pageStore.add("/page/p1.html", {template: "/template/t1.html", title: "hello"});
		renderer.pageStore.add("/page/p2.html", {template: "/template/t2.html", content: {$ref:"/page/teaser.html"}});
		renderer.pageStore.add("/page/teaser.html", {template: "/template/t3.html", text: "hello world"});
		renderer.pageStore.add("/page/complex.html", {template: "/template/complex.html", complex: {text:"hello"}});



    doh.register("render", [
      function testProperty(){
				when(renderer.render("/page/p1.html")).then(function(result) {
					doh.assertEqual("<title>hello</title>", result);
				});
      },
      function testInclude(){
				var html="";
				renderer.pageStore = new MemoryStore();
				when(renderer.render("/page/p2.html")).then(function(result) {
					html= result;
				});
				doh.assertEqual("<body><p>hello world</p></body>", html);
      },
      function testComplex(){
				var html="";
				renderer.pageStore = new MemoryStore();
				when(renderer.render("/page/complex.html")).then(function(result) {
					html= result;
				});
				doh.assertEqual("<p>hello</p>", html);
      },
    ]);

});




query for top-level: where url.containsNo("/")
wher url.startsWith(parentUrl)

add parentUrl index


page:
- type: folder/page/
- parent: ref
- filename
-id


template:

name:
url: /products/{productName}
parameter:
[
    productName:{url: /entities/product?productName={productName}}

]

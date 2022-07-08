---
sidebar_position: 1
---

# Create a Specification

In this tutorial, you will be creating a specification for a very simple **URL Shortener** service. This specification will include extensions for generation of OpenAPI v3 and gRPC proto documents.

## Create your first Apex spec

Create a directory called `urlshortener` containing a file named `spec.apexlang`. Populate it with the contents below:

```apexlang title="spec.apexlang"
import * from "@apexlang/core"
import * from "@apexlang/rest"
import * from "@apexlang/openapi"

namespace "urlshortener.v1"
  @info(
    title: "Simple URL shortener API"
    description: "Simple API for shortening URLs created using Apex."
    version: "1.0.0"
    termsOfService: "https://api.goodcorp.com/terms/"
    contact: {
      name: "API Support"
      url: "https://api.goodcorp.com/support"
      email: "api@goodcorp.com"
    },
    license: {
      name: "Apache 2.0"
      url: "https://www.apache.org/licenses/LICENSE-2.0"
    }
  )
  @host("api.goodcorp.com")
  @path("/v1")

"The URL shortening service."
role Shortener @service @uses(["Repository"]) {
  "Shorten a URL and return a generated identifier."
  shorten(url: string @n(1) @url): URL
    @PUT @path("/shorten")

  "Return the URL using the generated identifier."
  lookup(id: string @n(1)): URL
    @GET @path("/{id}")
}

"URL encapsulates the dynamic identifier and the URL it points to."
type URL {
  "The dynamically generated URL identifier."
  id: string @n(1)
  "The original URL that was shortened."
  url: string @n(2) @rename({go: "URL"})
}
```

## What's happening here?

Let's summarize what is captured in the **URL Shortener** service specification above.

* The `import` statements include directives, which adds strong typing to specific annotations, to assist in generating RESTful services with OpenAPI documentation as well as gRPC interfaces.
* The `namespace` identifies the scope of the components in the specification. In this case, it also includes several annotations required for the generated OpenAPI specification.
* `Shortener` with the `@service` is a components which will expose its operations for REST and gRPC.
* `URL` is the data structure returned by the operations in `Shortener`. The `@n` annotations on fields and parameters specify the field number and required for serialization formats like Protobuf. The `@rename` annotation is used to override the field name to fit the naming standards of a language.
* Every role, operation, type, and field has a description (enclosed in "") which passes through to generated files. For generated code, these descriptions are available inside your IDE.

This example highlights common elements you will use in your own specifications. If you are curious if you can create your own imports and directives, the answer is Yes! Apex is designed for extensibility. That will be covered later in [custom generators](/docs/tutorial-extras/custom-generators.md).

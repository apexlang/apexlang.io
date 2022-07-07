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

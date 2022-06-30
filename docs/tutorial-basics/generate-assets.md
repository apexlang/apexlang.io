---
sidebar_position: 3
---

# Generate Assets

We have configured Apex to generate an OpenAPI specification for our **URL Shortener** service. Now its time to perform the generation using the `apex` CLI.

## Running the code generator

Now we will be using the `apex generate` command to generate our desired assets.

```cli
Usage: apex generate [<config>]

Generate code from a configuration file.

Arguments:
  [<config>]    The code generation configuration file
```

If `config` is not specifed, the CLI will look for the configuration file at `apex.yaml` in the current directory.

Running `apex generate apex.yaml` will create `openapi.yaml` containing the OpenAPI specification.

```openapi title="openapi.yaml" showLineNumbers
swagger: '2.0'
info:
  title: Simple URL shortener API
  description: Simple API for shortening URLs created using Apex.
  version: 1.0.0
  termsOfService: 'https://api.goodcorp.com/terms/'
  contact:
    name: API Support
    url: 'https://api.goodcorp.com/support'
    email: api@goodcorp.com
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
host: api.goodcorp.com
basePath: /v1
paths:
  /shorten:
    put:
      operationId: shorten
      description: Shorten a URL and return a generated identifier.
      parameters:
        - name: url
          in: body
          required: true
          type: string
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/URL'
  '/{id}':
    get:
      operationId: lookup
      description: Return the URL using the generated identifier.
      parameters:
        - name: id
          in: path
          required: true
          type: string
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/URL'
definitions:
  URL:
    description: URL encapsulates the dynamic identifier and the URL it points to.
    type: object
    properties:
      id:
        description: The dynamically generated URL identifier.
        type: string
      url:
        description: The original URL that was shortened.
        type: string
    required:
      - id
      - url
```

Apex is not just a single purpose generator. You can make it generate pretty much anything. In addition to OpenAPI, lets add a `.proto` file for gRPC.

```yaml title="apex.yaml" showLineNumbers
spec: spec.apexlang
generates:
  openapi.yaml:
    module: '@apexlang/codegen/openapiv3'
    visitorClass: OpenAPIV3Visitor
  // highlight-start
  service.proto:
    module: '@apexlang/codegen/grpc'
    visitorClass: GRPCVisitor
  // highlight-end
```

If you are curious about other things that can be generated, view the [built-in generators](/docs/category/generators).

---
sidebar_position: 3
title: Generate API Specs
---

# Generate API Specifications

We have configured Apexlang to generate an OpenAPI specification for our **URL Shortener** service. Now its time to perform the generation using the `apex` CLI.

## Running the code generator

Now we will be using the `apex generate` command to generate our desired assets.

```cli
Usage: apex generate [<config>]

Generate code from a configuration file.

Arguments:
  [<config>]    The code generation configuration file
```

If `config` is not specified, the CLI will look for the configuration file at `apex.yaml` in the current directory.

Running `apex generate apex.yaml` will create `openapi.yaml` containing the OpenAPI specification.

```yaml title="openapi.yaml" showLineNumbers
openapi: 3.1.0
info:
  title: Simple URL shortener API
  description: Simple API for shortening URLs created using Apexlang.
  version: 1.0.0
  termsOfService: 'https://api.goodcorp.com/terms/'
  contact:
    name: API Support
    url: 'https://api.goodcorp.com/support'
    email: api@goodcorp.com
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
paths:
  /v1/shorten:
    put:
      operationId: shorten
      summary: Shorten a URL and return a generated identifier.
      description: Shorten a URL and return a generated identifier.
      responses:
        default:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/URL'
      tags:
        - Shortener
      requestBody:
        content:
          application/json:
            schema:
              properties:
                url:
                  type: string
              required:
                - url
        required: true
  '/v1/{id}':
    get:
      operationId: lookup
      summary: Return the URL using the generated identifier.
      description: Return the URL using the generated identifier.
      responses:
        default:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/URL'
      tags:
        - Shortener
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
tags:
  - name: Shortener
    description: The URL shortening service.
components:
  schemas:
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

:::info

Approximately 40 lines of Apexlang generates around 80 lines of OpenAPI YAML.

:::

In addition to OpenAPI, `apex` also generated the gRPC service defintion in `proto/service.proto`.

```protobuf title="proto/service.proto" showLineNumbers
syntax = "proto3";

package urlshortener.v1;

option go_package = "github.com/myorg/myapps/pkg/urlshortener";

// The URL shortening service.
service Shortener {
  // Shorten a URL and return a generated identifier.
  rpc Shorten(ShortenerShortenArgs) returns (URL) {};
  // Return the URL using the generated identifier.
  rpc Lookup(ShortenerLookupArgs) returns (URL) {};
}

// URL encapsulates the dynamic identifier and the URL it points to.
message URL {
  // The dynamically generated URL identifier.
  string id = 1;
  // The original URL that was shortened.
  string url = 2;
}

message ShortenerShortenArgs {
  string url = 1;
}

message ShortenerLookupArgs {
  string id = 1;
}
```

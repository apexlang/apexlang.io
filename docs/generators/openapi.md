---
title: OpenAPI
---

# OpenAPI Specification

Generate [Swagger/OpenAPI specification](https://swagger.io/specification/) files using Apexlang.

## OpenAPIV3Visitor

<p>
  <span className="badgeDarkBlue">Transport layer</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/openapiv3/openapiv3.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor creates a valid [Swagger/OpenAPI v3 specification](https://swagger.io/specification/) for all `@service` interfaces using [protoc-gen-go](https://grpc.io/docs/languages/go/quickstart/). This should be used in conjunction with a language specific wrapper generator (for example, [FiberVisitor for Go](go#fibervisitor)) to generate the boilerplate code.

#### Example

```yaml
generates:
  openapi.yaml:
    module: 'https://deno.land/x/apex_codegen@v0.1.2/openapiv3/mod.ts'
    visitorClass: OpenAPIV3Visitor
```

#### Configuration

Not applicable

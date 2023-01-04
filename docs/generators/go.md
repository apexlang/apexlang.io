---
title: Go
---

# Go

Generate code for the [Go programming language](https://go.dev).

## InterfacesVisitor

<p>
  <span className="badgeDarkBlue">Core logic</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/go/interfaces_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

Generates interfaces annotated with `@service` and `@dependency` along with structs and enums. These interfaces act as the main contract between the application's core logic and external dependencies such as other APIs or datasources.

#### Example

```yaml
config:
  package: myapp
generates:
  pkg/myapp/interfaces.go:
    module: 'https://deno.land/x/apex_codegen@v0.1.2/go/mod.ts'
    visitorClass: InterfacesVisitor
    config:
      # Used by ImportsVisitor, AliasVisitor
      aliases:
        UUID:
          type: uuid.UUID
          import: github.com/google/uuid
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `package` (common)      | The name of the Go package                    |
| `aliases`               | Maps Apex aliases to specific Go types        |

#### Callbacks

| Name                    | Description                                   |
| ----------------------- | --------------------------------------------- |
| `StructTags`            | Write additional struct tags to structs       |
| `UnionStructTags`       | Write additional struct tags to union structs |

#### Overridable Nested Visitors

| Class                   | Description                                   | Override function(s) |
| ----------------------- | --------------------------------------------- |-------------------|
| [`ImportsVisitor`](https://github.com/apexlang/codegen/blob/main/src/go/imports_visitor.ts) | Writes the imports required by the `.go` file. | `importsVisitor` |
| [`InterfaceVisitor`](https://github.com/apexlang/codegen/blob/main/src/go/interface_visitor.ts) | Writes an Go interface for all `@service` and `@dependency` Apex interfaces. | `serviceVisitor`, `dependencyVisitor` |
| [`StructVisitor `](https://github.com/apexlang/codegen/blob/main/src/go/struct_visitor.ts) | Writes a simple Go struct for Apex types. | `structVisitor` |
| [`EnumVisitor`](https://github.com/apexlang/codegen/blob/main/src/go/enum_visitor.ts) | Writes an enum using `const` and various `func`s. | `enumVisitor` |
| [`UnionVisitor`](https://github.com/apexlang/codegen/blob/main/src/go/union_visitor.ts) | Writes an Apex union as a Go struct with optional fields for each declared type. | `unionVisitor` |
| [`AliasVisitor`](https://github.com/apexlang/codegen/blob/main/src/go/alias_visitor.ts) | Writes an alias type to map to an internal or third-party Go type (e.g. UUID) | `aliasVisitor` |

## MainVisitor

<p>
  <span className="badgeDarkBlue">Project creation</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/go/main_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor creates the initial entry point (`main.go`) for your application and stubs out creation of services and dependencies and can server HTTP and/or gRPC.

#### Example

```yaml
generates:
  cmd/main.go:
    ifNotExists: true
    module: '@apexlang/codegen/go'
    visitorClass: MainVisitor
    config:
      package: myapp
      http:
        enabled: true
        defaultAddress: ":3000"
        environmentKey: HTTP_ADDRESS
      grpc:
        enabled: true
        defaultAddress: ":4000"
        environmentKey: GRPC_ADDRESS
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `package` (common)      | The name of the Go package                    |
| `module` (common)       | The application's Go module name              |
| `http.enabled`          | (default `true`) Flag to generate code to listen for HTTP |
| `http.defaultAddress`   | (default `:3000`) The default listening address for HTTP |
| `http.environmentKey`   | (default `HTTP_ADDRESS`) The environment variable to set the listening address for HTTP |
| `grpc.enabled`          | (default `true`) Flag to generate code to listen for gRPC |
| `grpc.defaultAddress`   | (default `:4000`) The default listening address for gRPC |
| `grpc.environmentKey`   | (default `GRPC_ADDRESS`) The environment variable to set the listening address for gRPC |

## ScaffoldVisitor

<p>
  <span className="badgeDarkBlue">Project creation</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/go/scaffold_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor will stub out an implementation for the configured interfaces leaving the developer to fill in the logic.

#### Example

```yaml
generates:
  pkg/myapp/services.go:
    ifNotExists: true
    module: '@apexlang/codegen/go'
    visitorClass: ScaffoldVisitor
    config:
      types:
        - service # any interfaces with @service
  pkg/myapp/repositories.go:
    ifNotExists: true
    module: '@apexlang/codegen/go'
    visitorClass: ScaffoldVisitor
    config:
      names:
        - Repository # a data store interface
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `package` (common)      | The name of the Go package                    |
| `names`                 | The names of specific interfaces to generate  |
| `types`                 | The types interfaces to generate based on annotations (i.e. `@service`) |

## FiberVisitor

<p>
  <span className="badgeDarkBlue">Transport layer</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/go/fiber_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor is used to create a REST/HTTP wrapper around `@service` interfaces using the [Fiber](https://gofiber.io) package. Since Fiber is built on top of [Fasthttp](https://github.com/valyala/fasthttp), your apps will be more tuned for high performance.

#### Example

```yaml
generates:
  pkg/myapp/interfaces.go:
    module: '@apexlang/codegen/go'
    visitorClass: FiberVisitor
    config:
      package: myapp
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `package` (common)      | The name of the Go package                    |

## GRPCVisitor

<p>
  <span className="badgeDarkBlue">Transport layer</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/go/grpc_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor is used to create a gRPC wrapper around `@service` interfaces using [protoc-gen-go](https://grpc.io/docs/languages/go/quickstart/). This should be used in conjunction with [ProtoVisitor](proto#protovisitor).

#### Example

```yaml
generates:
  pkg/myapp/interfaces.go:
    module: '@apexlang/codegen/go'
    visitorClass: GRPCVisitor
    config:
      package: myapp
      protoPackage: github.com/myorg/myapp/proto
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `package` (common)      | The name of the Go package                    |
| `protoPackage`          | The package name of the gRPC generated code   |

---
sidebar_position: 2
---

# Create a Configuration

An Apex configuration is YAML that defines which files are generated and by which module. The structure of configuration file is conveyed in Apex below.

```apexlang
"The top level elements of the configuration."
type Configuration {
  "The path to the apex specification file."
  schema: string,
  "Global configuration settings available to all targets (optional)."
  config: {string: any}?,
  "The map of target files to generate and their settings."
  generates: {string: Target}
}

"The configuration for how a target file is generated."
type Target {
  "The TypeScript module containing the visitor class."
  module: string,
  "The name of the exported visitor class that generates the file contents."
  visitorClass: string,
  "When true, the file is only generated if it does not exist. This is useful for scafolded files."
  ifNotExists: boolean = false,
  "Target-level configuration (optional)."
  config: {string: any}?
  "Commands to execute that relate to this target (e.g., other code generation tools)."
  runAfter: [Command]?
}

"A command to execute after code generator."
type Command {
  "The command to execute."
  command: string
  "The working directory (optional - default is the current directory)."
  dir: string?
}
```

## Create your first Apex configuration

A common task with regard to API and microservice development is sharing OpenAPI specifications with other teams. In this net step, we will generate the specification for our **URL Shortener** service. In the root of your `urlshortener` directory, create a file named `apex.yaml`:

```yaml title="apex.yaml"
spec: spec.apexlang
generates:
  openapi.yaml:
    module: '@apexlang/codegen/openapiv3'
    visitorClass: OpenAPIV3Visitor
```

Using `config`, `ifNotExists`, and `runAfter` will be demonstrated later in this tutorial.

---
title: Protocol Buffers
---

# Protocol Buffers

Generate `.proto` files with gRPC services included.

## ProtoVisitor

<p>
  <span className="badgeDarkBlue">Transport layer</span>
  <a href="https://github.com/apexlang/codegen/blob/main/src/proto/proto_visitor.ts" target="_blank" rel="noopener noreferrer">Source code <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></a>
</p>

This visitor creates a `.proto` file for all `@service` interfaces using [protoc-gen-go](https://grpc.io/docs/languages/go/quickstart/). This should be used in conjunction with a language specific wrapper generator (for example, [GRPCVisitor for Go](go#grpcvisitor)) to generate the boilerplate code.

#### Example

```yaml
generates:
  proto/service.proto:
    module: '@apexlang/codegen/proto'
    visitorClass: ProtoVisitor
    config:
      options:
        go_package: github.com/apexlang/outputtest/proto
    runAfter:
      - command: |
          protoc
          --go_out=.
          --go_opt=paths=source_relative
          --go-grpc_out=.
          --go-grpc_opt=paths=source_relative
          proto/service.proto
```

#### Configuration

| Field                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `options`               | A map of option names to values to include    |

:::info

You can use `runAfter` to execute `protoc` after the `.proto` is generated which will fully generate all your boilerplate code.

:::
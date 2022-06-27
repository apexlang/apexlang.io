---
sidebar_position: 1
---

# Create a Config

Add **Markdown or React** files to `src/pages` to create a **standalone page**:

- `src/pages/index.js` -> `localhost:3000/`
- `src/pages/foo.md` -> `localhost:3000/foo`
- `src/pages/foo/bar.js` -> `localhost:3000/foo/bar`

## Create your first Apex configuration

Create a file at `apex.yaml`:

```yaml title="apex.yaml"
spec: spec.apex
config:
  module: github.com/nanobus/examples/urlshortener
  package: urlshortener
  aliases:
    UUID:
      type: types.UUID
      import: github.com/nanobus/adapter-go/types
    datetime:
      type: types.Time
      import: github.com/nanobus/adapter-go/types
generates:
  cmd/main.go:
    ifNotExists: false
    module: '@nanobus/codegen/go'
    visitorClass: EntryPointVisitor
  pkg/urlshortener/adapter.go:
    module: '@nanobus/codegen/go'
    visitorClass: AdapterVisitor
  pkg/urlshortener/interfaces.go:
    module: '@nanobus/codegen/go'
    visitorClass: InterfacesVisitor
  pkg/urlshortener/service.go:
    ifNotExists: true
    module: '@nanobus/codegen/go'
    visitorClass: ScaffoldVisitor
  bus.yaml:
    ifNotExists: true
    module: '@nanobus/codegen/bus'
    visitorClass: BusVisitor
```

A new page is now available at `http://localhost:3000/my-react-page`.

## Create your first Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

A new page is now available at `http://localhost:3000/my-markdown-page`.

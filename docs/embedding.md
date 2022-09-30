---
sidebar_position: 7
---

# Embedding Apex into Apps

## Libraries

Apex natively supports TypeScript and Go.

* [@apexlang/core](https://github.com/apexlang/apex-js) - TypeScript Apex parser used by the CLI and VS Code extension
* [@apexlang/codegen](https://github.com/apexlang/codegen) - TypeScript code generation modules loaded by the Apex CLI (e.g. `apex generate`)
* [github.com/apexlang/apex-go](https://github.com/apexlang/apex-go) - Go Apex parser for embedding in Go platforms

## WebAssembly module

To reach a broader set of languages, the Apex Go parser is also released as a WebAssembly module and loadable via a Wasm runtime such as [Wasmtime](https://wasmtime.dev). The module parsers and validates an Apex specification and returns a JSON representation that is easier to interpret in languages with JSON support.

### Download

The latest **apex-parser.wasm** can be downloaded from the [Apex Go releases page](https://github.com/apexlang/apex-go/releases). The JSON representation is [documented here using Apex](https://github.com/apexlang/apex-go/blob/main/model.apexlang).

### Parsing and validating

The Wasm module exposes 3 functions:

* `_malloc(size u32) u32` - Allocate memory to pass in Apex specifications
* `_free(ptr u32)` - Free memory allocated by `_malloc`
* `parse(ptr u32, size u32) u64` - The main parse function that returns a valid JSON representation

:::info

Returned `u64` values represents a 32-bit pointer and size pair of a buffer. The upper 32-bits is for the pointer in the WebAssembly module's linear memory. The lower 32-bits stores the size of the buffer.

:::

```go
ptr := uintptr(ptrsize >> 32)
size := uint32(ptrsize & 0xFFFFFFFF)
```

Embedding Apex parsing in your application follows these steps:

1. calls `_malloc` to receive a buffer for the byte count of the Apex specification
2. copies or directly load the Apex specification into the allocated buffer
3. calls `parse` with the buffer pointer and size
4. extract the JSON (or error) string from the buffer returned
5. call `_free` to release the memory allocated by `_malloc` in step 1

If the returned string starts with `error:` then the string represents and error in the parser. Otherwise, it contains a valid JSON representation of your Apex specification.

### Resolving imports

If a specification contains imports, the module makes a host call to `apex::resolve` to retrieve the contents of the imported specification.

* `resolve(location_ptr u32, location_size u32, from_ptr u32, from_size u32) u64` - Loads an imported Apex specification

`location` and `from` are string values. `location` is the specification to load and `from` is the specification performing the import. The Apex CLI installs importable definitions in `~/.apex/definitions` your implementation could load them from alternate locations.

### Example

[Here is an example](https://github.com/apexlang/apex-go/blob/main/cmd/host/main.go) using [wazero](https://wazero.io/) to invoke the Apex parser.

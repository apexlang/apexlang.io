---
sidebar_position: 7
---

# Embedding Apex into Apps

Apex is most commonly used as a code generator for your projects. In some cases, your system may need to read in the information comtained in an Apex specification. This could be useful for platforms or tools to inspect specifications dynamically. Some scenarios include:

* Validating or sanitizing input data
* Comparing two versions to detect a breaking change
* Discovering data elements that are sensitive (PCI/DSS) or encrypted

## Libraries

Apex natively supports TypeScript and Go.

* [@apexlang/core](https://github.com/apexlang/apex-js) - TypeScript Apex parser used by the CLI and VS Code extension
* [@apexlang/codegen](https://github.com/apexlang/codegen) - TypeScript code generation modules loaded by the Apex CLI (e.g. `apex generate`)
* [github.com/apexlang/apex-go](https://github.com/apexlang/apex-go) - Go Apex parser for embedding in Go platforms

## WebAssembly module

To reach a broader set of languages, the Apex Go parser is also released as a WebAssembly module and loadable via a Wasm runtime such as [Wasmtime](https://wasmtime.dev). The module parses and validates an Apex specification and returns a JSON representation that is easier to interpret in languages with JSON support.

### Download

Two implementations of the Wasm module can be downloaded from the [Apex Go releases page](https://github.com/apexlang/apex-go/releases).

* **[waPC](https://github.com/apexlang/apex-go/releases/latest/download/apex-wapc.wasm)** - Uses the [waPC protocol](https://wapc.io/docs/spec/) to invoke the Apex parser. This is the easiest method for integration, however you must be using a programming language that has a [waPC host implementation](https://github.com/wapc).
* **[Core Wasm](https://github.com/apexlang/apex-go/releases/latest/download/apex-parser.wasm)** - Loadable by any programming language with a WebAssembly runtime (e.g. [Wasmtime](https://wasmtime.dev)); however, puts the responsibility of passing in the specification on your application.

Each parser accepts an Apex specification as a string and returns the JSON string represention. The JSON follows [this schema](https://github.com/apexlang/apex-go/blob/main/model.apexlang).

### waPC <small>(apex-wapc.wasm)</small>

#### `parse` guest call

Operation: `apexlang.v1.Parser/parse`

Input formatted as [MsgPack](https://msgpack.org)

```json
{
  "source": "... Apex specification as string ..."
}
```

Output formatted as [MsgPack](https://msgpack.org)

```json
{
  "namespace": { /* The parsed Apex namespace. See model spec. */ },
  /* or */
  "errors": [
    {
      "message": "... The error message ...",
      "positions": [ 1032 /* array of positions in the document where the error occurs*/ ],
      "locations": [
        {
          "line": 123, /* The line number of the error */
          "column": 10 /* The column number of the error */
        }
      ]
    }
  ]
}
```

#### `resolve` host call

Namespace: `apexlang.v1.Resolver`<br/>
Operation: `resolve`

Input formatted as [MsgPack](https://msgpack.org)

```json
{
  "location": "The imported specification to resolve",
  "from": "The specification performing the import"
}
```

### Core Wasm <small>(apex-perser.wasm)</small>

#### Parsing and validating

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

#### Resolving imports

If a specification contains imports, the module makes a host call to `apex::resolve` to retrieve the contents of the imported specification.

* `resolve(location_ptr u32, location_size u32, from_ptr u32, from_size u32) u64` - Loads an imported Apex specification

`location` and `from` are string values. `location` is the specification to load and `from` is the specification performing the import. The Apex CLI installs importable definitions in `~/.apex/definitions` your implementation could load them from alternate locations.

#### Example

[Here is an example](https://github.com/apexlang/apex-go/blob/main/cmd/host/main.go) using [wazero](https://wazero.io/) to invoke the Apex parser.

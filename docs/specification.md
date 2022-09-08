---
sidebar_position: 6
---

# Language Specification

### Namespace

Declared at the top of the Apex document, the `namespace` is used to identify and refer to elements contained in the Apex document. It may be used by the code generator to target filesystem locations of where to write generated files.

```apexlang
namespace "customers"
```

Including a version suffix is the recommended way for your application to support multiple versions.

```apexlang
namespace "customers.v1"
```

### Scalar Types

Instead of using the `number` type for all numeric values, Apex inherits more specific integer and floating point types:

| Apex Type  | Description                |
| ---------- | -------------------------- |
| `i8`       | A 8-bit signed integer.    |
| `u8`       | A 8-bit unsigned integer.  |
| `i16`      | A 16-bit signed integer.   |
| `u16`      | A 16-bit unsigned integer. |
| `i32`      | A 32-bit signed integer.   |
| `u32`      | A 32-bit unsigned integer. |
| `i64`      | A 64-bit signed integer.   |
| `u64`      | A 64-bit unsigned integer. |
| `f32`      | A 32-bit float.            |
| `f64`      | A 64-bit float.            |
| `bool`     | A boolean.                 |

Apex also includes the following special types that are decoded into language-specific types:

| Apex Type  | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `string`   | a UTF-8 encoded string.                                                  |
| `datetime` | a RFC 3339 formatted date / time / timezone.                             |
| `bytes`    | an array of bytes of arbitrary length.                                   |
| `any`      | a language specific type, list, or map value that is determined at runtime. |
| `raw`      | a raw encoded value that can be decoded at a later point in the program. |

### Collections

Types can be encapsulated in arrays and maps with enclosing syntax:

| Collection | Apex Syntax         | Description                                  |
| ---------- | ------------------- | -------------------------------------------- |
| Array      | `[string]`          | A randomly accessible sequence of values.    |
| Map        | `{string : string}` | A mapping of keys to values. Keys must be an integer or string. Values can be any scalar type or object type. |

**Caution about using maps**: In some languages, like Go, the iteration order on maps is considered "undefined". This means that the serialized bytes can be different for the same data. Keep this in mind if you need to compare or create hashes of the serialized data. Using arrays of an object type that contains `key` and `value` might be preferable.

### Optional values

By default, a declared type is required and if unset, contains a zero value (`0`, `""`, empty array or map). To make any type optional (nullable), follow it with a `?`. For example,  `string?` represents an optional string value.

### Functions

Functions are independent operations and allow two patterns for parameter input.

Common functions accept zero or more parameters and are generated with the same signature defined in Apex. Functions are recommended when passing in a small number of fields and follow a simple, familiar, and easy to read format. All parameters must be named. In this example, we pass in first and last names to create a customer and return its new identifier as a `u64`.

```apexlang
func createCustomer(firstName: string, lastName: string): u64
```

Now, let's say you want to model a request/reply style operation or you want to accept a large number of fields inside a wrapper object. This is where [unary operations](https://en.wikipedia.org/wiki/Unary_operation) are preferred. In contrast to functions, unary operations accept exactly one input.

Instead of using parenthesis `(...)` to enclose parameters, unary operations use brackets `[...]` to enclose a single parameter. This is what `createCustomer` would look like accepting a Customer data type. We'll look at how `Customer` is defined shortly.

```apexlang
func createCustomer[customer: Customer]: u64
```

Why the different syntax? In the case of common functions, multiple parameters are possible so the arguments are likely encapsulated in a wrapper object for serialization. For unary operations, since there is a single parameter no wrapper object is required and the input object can be serialized directly. This syntax is necessary for the the code generation tools to generate the appropriate client and server code.

### Interfaces

Interfaces are conceptual groups of operations that allow the developer to divide communication into multiple components. Typically, interfaces are named according to their purpose. For example, a distributed calculator could split each mathematical operation into different roles implemented by different modules.

```apexlang
interface Adder {
  add(addend1: i64, addend2: i64): i64
}

interface Subtractor {
  subtract(minuend: i64, subtrahend: i64): i64
}

interface Multiplier {
  multiply(factor1: i64, factor2: i64): i64
}

interface Divider {
  divide(dividend: i64, divisor: i64): i64
}
```

Interfaces can be either internal or external to your application. Apex code generation modules can make use of Annotations and Directives (described below) to generate either invokers (caller side) or handlers (callee side).

### Object types

The most basic component of a Apex schema are object types, which represent a kind of object you can pass to or return from operations, and what fields it has. Types are defined in a language-agnostic way. This means that complex features like nested structures, inheritance, and generics/templates are omitted by design.

In Apex, we might declare `Customer` like this:

```apexlang
type Customer {
  firstName:  string
  middleName: string?
  lastName:   string
  address1:   string
  address2:   string?
  city:       string
  zipcode:    string
  email:      string
  phones:     [PhoneNumber]
}
```

### Enumeration types

Enumerations (or enums) are a type that is constrained to a finite set of allowed values.

In `Customer`, we are allowing multiple mobile, home, or work phone numbers. Here's what a `PhoneType` enum definition might look like.

```apexlang
type PhoneNumber {
  number: string
  type:   PhoneType
}

enum PhoneType {
  mobile = 0 as "Mobile"
  home   = 1 as "Home"
  work   = 2 as "Work"
}
```

Each enum value denotes its programatic / variable name, the integer value that is serialized, and a display or friendly name for printing. Note that Apex does not address internationalization so custom code is required to print the value in multiple spoken languages.

### Union types

Unions types denote that a type can have one of several representations.

```apexlang
union Animal = Cat | Dog
```

The code generator must provide a way to determine the actual type at runtime and handle serialization if necessary.

### Descriptions

All elements in Apex can have descriptions which serve as documentation throughout the file. The code generation tools should also preserve descriptions as documentation/comments where appropriate so that you only need to worry about documenting functionality in one place.

Descriptions can be a single line or multiple lines.

Single line

```apexlang
"Encapsulates a phone number and its type"
type PhoneNumber {
  "The phone number"
  number: string
  "The phone type"
  type: PhoneType
}
```

Multiple lines

```apexlang
"""
Encapsulates a phone number and its type.
The phone number is a single string value and contains
the country code, area code, prefix, and line number.
"""
type PhoneNumber {
  "The phone number"
  number: string
  "The phone type"
  type: PhoneType
}
```

### Default values

Default values for Fields can specified when a type is initialized.  Codegen implementation for default values may vary based on limitations of the target language.

```apexlang
type PhoneNumber {
  number: string
  type:   PhoneType = mobile
}
```

### Annotations and Directives

Annotations attach additional metadata to elements. These can be used in the code generation tool to implement custom functionality for your use case. Annotations have a name and zero or many arguments.

Here is what `Customer` might look like with annotations.

```apexlang
type Customer {
  firstName:  string        @notEmpty
  middleName: string?       @notEmpty
  lastName:   string        @notEmpty
  address1:   string        @notEmpty
  address2:   string?       @notEmpty
  city:       string        @length(2)
  zipcode:    string        @length(5)
  email:      string        @email @range(min: 5, max: 80)
  phones:     [PhoneNumber]
}
```

Multiple annotations can be attached to an element. All annotations have named arguments; however, there are two shorthand syntax options.

| Shorthand    | Equivalent to       | Comments                              |
| ------------ | ------------------- | --------------------------------------|
| `@notEmpty`  | `@notEmpty()`       | Useful for "has annotation" checks.   |
| `@length(5)` | `@length(value: 5)` | `value` is the default argument name. |

The annotation examples above shows a validation scenario but annotations are not limited to this purpose. The developer has the freedom to extend the code generation tool to leverage annotations for their application's needs. In the `Customer` example, the developer could use these annotations to generate `validate` methods on each of the generated object types.

Directives are used to ensure that an annotation's arguments match an expected format. For constraining a numeric or length range, the directive for `@range` might look like this:

```apexlang
directive @range(min: u32, max: u32)
  on FIELD
  require @valid on TYPE
```

This directive specifies parameters but also where it can be applied. The syntax `on FIELD require @valid on TYPE` means "only allow this on fields where there is also an @valid annotation on its type". Multiple locations are supported and delimited with `|`:

```apexlang
NAMESPACE | INTERFACE | OPERATION | PARAMETER | TYPE | FIELD | ENUM | ENUM_VALUE | UNION | ALIAS
```

Directives improve the user experience of annotations by giving the developer useful error details when the annotations are invalid.  Directives can be in the main file or be made available through imports.

### Imports

Apex can integrate external modules using the `import` command. For example, OpenAPI annotations can be imported with the following statement:

```apexlang
import * from "@apexlang/openapi"
```

Is is also possible to import specific definitions:

```apexlang
import { @info } from "@apexlang/openapi"
```

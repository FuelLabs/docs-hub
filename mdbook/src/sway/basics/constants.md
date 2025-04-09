# Constants

<!-- This section should explain what constants are in Sway -->
<!-- constants:example:start -->
Constants are similar to variables; however, there are a few differences:

- Constants are always evaluated at compile-time.
- Constants can be declared both inside of a [function](../index.md) and at global / `impl` scope.
- The `mut` keyword cannot be used with constants.
<!-- constants:example:end -->

```sway
const ID: u32 = 0;
```

Constant initializer expressions can be quite complex, but they cannot use, for
instance, assembly instructions, storage access, mutable variables, loops and
`return` statements. Although, function calls, primitive types and compound data
structures are perfectly fine to use:

```sway
fn bool_to_num(b: bool) -> u64 {
    if b {
        1
    } else {
        0
    }
}

fn arr_wrapper(a: u64, b: u64, c: u64) -> [u64; 3] {
    [a, b, c]
}

const ARR2 = arr_wrapper(bool_to_num(1) + 42, 2, 3);
```

## Associated Constants

<!-- This section should explain what associated constants are -->
<!-- assoc_constants:example:start -->
Associated constants are constants associated with a type and can be declared in an `impl` block or in a `trait` definition.

Associated constants declared inside a `trait` definition may omit their initializers to indicate that each implementation of the trait must specify those initializers.

The identifier is the name of the constant used in the path. The type is the type that the
definition has to implement.
<!-- assoc_constants:example:end -->

You can _define_ an associated `const` directly in the interface surface of a trait:

```sway
script;

trait ConstantId {
    const ID: u32 = 0;
}
```

Alternatively, you can also _declare_ it in the trait, and implement it in the interface of the
types implementing the trait.

```sway
script;

trait ConstantId {
    const ID: u32;
}

struct Struct {}

impl ConstantId for Struct {
    const ID: u32 = 1;
}

fn main() -> u32 {
    Struct::ID
}
```

### `impl self` Constants

Constants can also be declared inside non-trait `impl` blocks.

```sway
script;

struct Point {
    x: u64,
    y: u64,
}

impl Point {
    const ZERO: Point = Point { x: 0, y: 0 };
}

fn main() -> u64  {
    Point::ZERO.x
}
```

## Configurable Constants

<!-- This section should explain what configurable constants are in Sway -->
<!-- config_constants:example:start -->
Configurable constants are special constants that behave like regular constants in the sense that they cannot change during program execution, but they can be configured _after_ the Sway program has been built. The Rust and TS SDKs allow updating the values of these constants by injecting new values for them directly in the bytecode without having to build the program again. These are useful for contract factories and behave somewhat similarly to `immutable` variables from languages like Solidity.
<!-- config_constants:example:end -->

Configurable constants are declared inside a `configurable` block and require a type ascription and an initializer as follows:

```sway
contract;

enum EnumWithGeneric<D> {
    VariantOne: D,
    VariantTwo: (),
}

struct StructWithGeneric<D> {
    field_1: D,
    field_2: u64,
}

// ANCHOR: configurable_block
configurable {
    U8: u8 = 8u8,
    BOOL: bool = true,
    ARRAY: [u32; 3] = [253u32, 254u32, 255u32],
    STR_4: str[4] = __to_str_array("fuel"),
    STRUCT: StructWithGeneric<u8> = StructWithGeneric {
        field_1: 8u8,
        field_2: 16,
    },
    ENUM: EnumWithGeneric<bool> = EnumWithGeneric::VariantOne(true),
}
// ANCHOR_END: configurable_block 

abi TestContract {
    fn return_configurables() -> (u8, bool, [u32; 3], str[4], StructWithGeneric<u8>);
}

impl TestContract for Contract {
    // ANCHOR: using_configurables
    fn return_configurables() -> (u8, bool, [u32; 3], str[4], StructWithGeneric<u8>) {
        (U8, BOOL, ARRAY, STR_4, STRUCT)
    }
    // ANCHOR_END: using_configurables
}
```

At most one `configurable` block is allowed in a Sway project. Moreover, `configurable` blocks are not allowed in libraries.

Configurable constants can be read directly just like regular constants:

```sway
contract;

enum EnumWithGeneric<D> {
    VariantOne: D,
    VariantTwo: (),
}

struct StructWithGeneric<D> {
    field_1: D,
    field_2: u64,
}

// ANCHOR: configurable_block
configurable {
    U8: u8 = 8u8,
    BOOL: bool = true,
    ARRAY: [u32; 3] = [253u32, 254u32, 255u32],
    STR_4: str[4] = __to_str_array("fuel"),
    STRUCT: StructWithGeneric<u8> = StructWithGeneric {
        field_1: 8u8,
        field_2: 16,
    },
    ENUM: EnumWithGeneric<bool> = EnumWithGeneric::VariantOne(true),
}
// ANCHOR_END: configurable_block 

abi TestContract {
    fn return_configurables() -> (u8, bool, [u32; 3], str[4], StructWithGeneric<u8>);
}

impl TestContract for Contract {
    // ANCHOR: using_configurables
    fn return_configurables() -> (u8, bool, [u32; 3], str[4], StructWithGeneric<u8>) {
        (U8, BOOL, ARRAY, STR_4, STRUCT)
    }
    // ANCHOR_END: using_configurables
}
```

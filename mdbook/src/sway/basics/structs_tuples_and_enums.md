# Structs, Tuples, and Enums

## Structs

<!-- This section should explain structs in Sway -->
<!-- structs:example:start -->
Structs in Sway are a named grouping of types. You may also be familiar with structs via another name: _product types_. Sway does not make any significantly unique usages of structs; they are similar to most other languages which have structs. If you're coming from an object-oriented background, a struct is like the data attributes of an object.

Those data attributes are called _fields_ and can be either public or private.

Private struct fields can be accessed only within the module in which their struct is declared. Public fields are accessible everywhere where the struct is accessible. This access control on the field level allows more fine grained encapsulation of data.

<!-- structs:example:end -->

To explain these concepts, let's take a look at the following example, in which we have a module called _data_structures_.

In that module, we declare a struct named `Foo` with two fields. The first field is named `bar`, it is public and it accepts values of type `u64`. The second field is named `baz`, it is also public and it accepts `bool` values.

In a similar way, we define the structs `Point`, `Line`, and `TupleInStruct`. Since all those structs are public, and all their fields are public, they can be instantiated in other modules using the _struct instantiation syntax_ as shown below.

On the other hand, the struct `StructWithPrivateFields` can be instantiated only within the _data_structures_ module, because it contains private fields. To be able to create instances of such structs outside of the module in which they are declared, the struct must offer [constructor associated functions](methods_and_associated_functions.md#constructors).

```sway
```sway\n// the _data_structures_ module
library;

// Declare a struct type
pub struct Foo {
    pub bar: u64,
    pub baz: bool,
}

// Struct types for destructuring
pub struct Point {
    pub x: u64,
    pub y: u64,
}

pub struct Line {
    pub p1: Point,
    pub p2: Point,
}

pub struct TupleInStruct {
    pub nested_tuple: (u64, (u32, (bool, str))),
}

// Struct type instantiable only in the module _data_structures_
pub struct StructWithPrivateFields {
    pub public_field: u64,
    private_field: u64,
    other_private_field: u64,
}\n```
```

<!-- This section should explain how to instantiate a struct in Sway -->
<!-- new_struct:example:start -->
In order to instantiate the struct we use _struct instantiation syntax_, which is very similar to the declaration syntax except with expressions in place of types.

There are three ways to instantiate the struct.

- Hard coding values for the fields
- Passing in variables with names different than the struct fields
- Using a shorthand notation via variables that are the same as the field names
<!-- new_struct:example:end -->

```sway
```sway\nlibrary;

mod data_structures;
use data_structures::{Foo, Line, Point, TupleInStruct};

fn hardcoded_instantiation() -> Foo {
    // Instantiate `foo` as `Foo`
    let mut foo = Foo {
        bar: 42,
        baz: false,
    };

    // Access and write to "baz"
    foo.baz = true;

    // Return the struct
    foo
}

fn variable_instantiation() -> Foo {
    // Declare variables with the same names as the fields in `Foo`
    let number = 42;
    let truthness = false;

    // Instantiate `foo` as `Foo`
    let mut foo = Foo {
        bar: number,
        baz: truthness,
    };

    // Access and write to "baz"
    foo.baz = true;

    // Return the struct
    foo
}

fn shorthand_instantiation() -> Foo {
    // Declare variables with the same names as the fields in `Foo`
    let bar = 42;
    let baz = false;

    // Instantiate `foo` as `Foo`
    let mut foo = Foo { bar, baz };

    // Access and write to "baz"
    foo.baz = true;

    // Return the struct
    foo
}

fn struct_destructuring() {
    let point1 = Point { x: 0, y: 0 };
    // Destructure the values from the struct into variables
    let Point { x, y } = point1;

    let point2 = Point { x: 1, y: 1 };
    // If you do not care about specific struct fields then use ".." at the end of your variable list
    let Point { x, .. } = point2;

    let line = Line {
        p1: point1,
        p2: point2,
    };
    // Destructure the values from the nested structs into variables
    let Line {
        p1: Point { x: x0, y: y0 },
        p2: Point { x: x1, y: y1 },
    } = line;
    // You may also destructure tuples nested in structs and structs nested in tuples
    let tuple_in_struct = TupleInStruct {
        nested_tuple: (42u64, (42u32, (true, "ok"))),
    };
    let TupleInStruct {
        nested_tuple: (a, (b, (c, d))),
    } = tuple_in_struct;

    let struct_in_tuple = (Point { x: 2, y: 4 }, Point { x: 3, y: 6 });
    let (Point { x: x0, y: y0 }, Point { x: x1, y: y1 }) = struct_in_tuple;
}\n```
```

> **Note**
> You can mix and match all 3 ways to instantiate the struct at the same time.
> Moreover, the order of the fields does not matter when instantiating however we encourage declaring the fields in alphabetical order and instantiating them in the same alphabetical order

Furthermore, multiple variables can be extracted from a struct using the destructuring syntax.

### Struct Memory Layout

> **Note**
> This information is not vital if you are new to the language, or programming in general

Structs have zero memory overhead. What that means is that in memory, each struct field is laid out sequentially. No metadata regarding the struct's name or other properties is preserved at runtime. In other words, structs are compile-time constructs. This is the same in Rust, but different in other languages with runtimes like Java.

## Tuples

<!-- This section should explain what tuples are and how to access tuple values -->
<!-- tuples:example:start -->
Tuples are a [basic static-length type](./built_in_types.md#tuple-types) which contain multiple different types within themselves. The type of a tuple is defined by the types of the values within it, and a tuple can contain basic types as well as structs and enums.

You can access values directly by using the `.` syntax. Moreover, multiple variables can be extracted from a tuple using the destructuring syntax.
<!-- tuples:example:end -->

```sway
```sway\nlibrary;

fn tuple() {
    // You can declare the types yourself
    let tuple1: (u8, bool, u64) = (100, false, 10000);

    // Or have the types be inferred
    let mut tuple2 = (5, true, ("Sway", 8));

    // Retrieve values from tuples
    let number = tuple1.0;
    let sway = tuple2.2.1;

    // Destructure the values from the tuple into variables
    let (n1, truthness, n2) = tuple1;

    // If you do not care about specific values then use "_"
    let (_, truthness, _) = tuple2;

    // Internally mutate the tuple
    tuple2.1 = false;

    // Or change the values all at once (must keep the same data types)
    tuple2 = (9, false, ("Fuel", 99));
}\n```
```

## Enums

<!-- This section should explain what enums are -->
<!-- enums:example:start -->
_Enumerations_, or _enums_, are also known as _sum types_. An enum is a type that could be one of several variants. To declare an enum, you enumerate all potential variants.
<!-- enums:example:end -->

Here, we have defined five potential colors. Each enum variant is just the color name. As there is no extra data associated with each variant, we say that each variant is of type `()`, or unit.

```sway
```sway\nlibrary;

// Declare the enum
enum Color {
    Blue: (),
    Green: (),
    Red: (),
    Silver: (),
    Grey: (),
}

fn main() {
    // To instantiate a variable with the value of an enum the syntax is
    let blue = Color::Blue;
    let silver = Color::Silver;
}\n```
```

### Enums of Structs

It is also possible to have an enum variant contain extra data. Take a look at this more substantial example, which combines struct declarations with enum variants:

```sway
```sway\nlibrary;

struct Item {
    price: u64,
    amount: u64,
    id: u64,
}

enum MyEnum {
    Item: Item,
}

fn main() {
    let my_enum = MyEnum::Item(Item {
        price: 5,
        amount: 2,
        id: 42,
    });
}\n```
```

### Enums of Enums

It is possible to define enums of enums:

```sway
```sway\nlibrary;

pub enum Error {
    StateError: StateError,
    UserError: UserError,
}

pub enum StateError {
    Void: (),
    Pending: (),
    Completed: (),
}

pub enum UserError {
    InsufficientPermissions: (),
    Unauthorized: (),
}\n```
```

#### Preferred usage

The preferred way to use enums is to use the individual (not nested) enums directly because they are easy to follow and the lines are short:

```sway
```sway\nlibrary;

use ::enum_of_enums::{StateError, UserError};

fn preferred() {
    let error1 = StateError::Void;
    let error2 = UserError::Unauthorized;
}\n```
```

#### Inadvisable

If you wish to use the nested form of enums via the `Error` enum from the example above, then you can instantiate them into variables using the following syntax:

```sway
```sway\nlibrary;

use ::enum_of_enums::{Error, StateError, UserError};

fn avoid() {
    let error1 = Error::StateError(StateError::Void);
    let error2 = Error::UserError(UserError::Unauthorized);
}\n```
```

Key points to note:

- You must import all of the enums you need instead of just the `Error` enum
- The lines may get unnecessarily long (depending on the names)
- The syntax is not the most ergonomic

### Enum Memory Layout

> **Note**
> This information is not vital if you are new to the language, or programming in general.

Enums do have some memory overhead. To know which variant is being represented, Sway stores a one-word (8-byte) tag for the enum variant. The space reserved after the tag is equivalent to the size of the _largest_ enum variant. So, to calculate the size of an enum in memory, add 8 bytes to the size of the largest variant. For example, in the case of `Color` above, where the variants are all `()`, the size would be 8 bytes since the size of the largest variant is 0 bytes.

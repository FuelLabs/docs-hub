# Methods and Associated Functions

<!-- This section should explain methods & associated functions in Sway -->
<!-- methods_af:example:start -->
## Methods

Methods are similar to [functions](functions.md) in that we declare them with the `fn` keyword and they have parameters and return a value. However, unlike functions, _Methods_ are defined within the context of a struct (or enum), and either refers to that type or mutates it. The first parameter of a method is always `self`, which represents the instance of the struct (or enum) the method is being called on.

## Associated Functions

_Associated functions_ are very similar to _methods_, in that they are also defined in the context of a struct or enum, but they do not actually use any of the data in the struct and as a result do not take _self_ as a parameter. Associated functions could be standalone functions, but they are included in a specific type for organizational or semantic reasons.

### Constructors

Constructors are associated functions that construct, or in other words instantiate, new instances of a type. Their return type is always the type itself. E.g., public structs that have private fields must provide a public constructor, or otherwise they cannot be instantiated outside of the module in which they are declared.

## Declaring Methods and Associated Functions

To declare methods and associated functions for a struct or enum, use an `impl` block. Here, `impl` is short for implementation.
<!-- methods_af:example:end -->

```sway
script;

struct Foo {
    bar: u64,
    baz: bool,
}

impl Foo {
    // this is a _method_, as it takes `self` as a parameter.
    fn is_baz_true(self) -> bool {
        self.baz
    }

    // this is an _associated function_, since it does not take `self` as a parameter.
    // it is at the same time a _constructor_ because it instantiates and returns
    // a new instance of `Foo`.
    fn new_foo(number: u64, boolean: bool) -> Foo {
        Foo {
            bar: number,
            baz: boolean,
        }
    }
}

fn main() {
    let foo = Foo::new_foo(42, true);
    assert(foo.is_baz_true());
}
```

<!-- This section should explain how to call a method -->
<!-- call_method:example:start -->
To call a method, simply use dot syntax: `foo.iz_baz_true()`.
<!-- call_method:example:end -->

<!-- This section should explain how methods + assoc. fns can accept `ref mut` params -->
<!-- ref_mut:example:start -->
Similarly to [free functions](functions.md), methods and associated functions may accept `ref mut` parameters.
<!-- ref_mut:example:end -->

For example:

```sway
struct Coordinates {
    x: u64,
    y: u64,
}

impl Coordinates {
    fn move_right(ref mut self, distance: u64) {
        self.x += distance;
    }
}
```

and when called:

```sway
let mut point = Coordinates { x: 1, y: 1 };
    point.move_right(5);
    assert(point.x == 6);
    assert(point.y == 1);
```

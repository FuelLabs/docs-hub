# Functions

Functions in Sway are declared with the `fn` keyword. Let's take a look:

```sway
fn equals(first_param: u64, second_param: u64) -> bool {
    first_param == second_param
}
```

We have just declared a function named `equals` which takes two parameters: `first_param` and `second_param`. The parameters must both be 64-bit unsigned integers.

This function also returns a `bool` value, i.e. either `true` or `false`. This function returns `true` if the two given parameters are equal, and `false` if they are not. If we want to use this function, we can do so like this:

```sway
fn main() {
    equals(5, 5); // evaluates to `true`
    equals(5, 6); // evaluates to `false`
}
```

## Mutable Parameters

<!-- This section should explain how/when to use `ref mut` -->
<!-- ref_mut:example:start -->
We can make a function parameter mutable by adding `ref mut` before the parameter name. This allows mutating the argument passed into the function when the function is called.
<!-- ref_mut:example:end -->

For example:

```sway
fn increment(ref mut num: u32) {
    let prev = num;
    num = prev + 1u32;
}
```

This function is allowed to mutate its parameter `num` because of the `mut` keyword. In addition, the `ref` keyword instructs the function to modify the argument passed to it when the function is called, instead of modifying a local copy of it.

```sway
let mut num: u32 = 0;
    increment(num);
    assert(num == 1u32); // The function `increment()` modifies `num`
```

Note that the variable `num` itself has to be declared as mutable for the above to compile.

> **Note**
> It is not currently allowed to use `mut` without `ref` or vice versa for a function parameter.

Similarly, `ref mut` can be used with more complex data types such as:

```sway
fn swap_tuple(ref mut pair: (u64, u64)) {
    let temp = pair.0;
    pair.0 = pair.1;
    pair.1 = temp;
}

fn update_color(ref mut color: Color, new_color: Color) {
    color = new_color;
}
```

We can then call these functions as shown below:

```sway
let mut tuple = (42, 24);
    swap_tuple(tuple);
    assert(tuple.0 == 24); // The function `swap_tuple()` modifies `tuple.0`
    assert(tuple.1 == 42); // The function `swap_tuple()` modifies `tuple.1`
    let mut color = Color::Red;
    update_color(color, Color::Blue);
    assert(match color {
        Color::Blue => true,
        _ => false,
    }); // The function `update_color()` modifies the color to Blue
```

> **Note**
> The only place, in a Sway program, where the `ref` keyword is valid is before a mutable function parameter.

# Control Flow

## `if` expressions

<!-- This section should explain `if` expressions in Sway -->
<!-- if:example:start -->
Sway supports _if_, _else_, and _else if_ expressions that allow you to branch your code depending on conditions.
<!-- if:example:end -->

For example:

```sway
fn main() {
    let number = 6;

    if number % 4 == 0 {
        // do something
    } else if number % 3 == 0 {
        // do something else
    } else {
        // do something else
    }
}
```

### Using `if` in a `let` statement

Like Rust, `if`s are expressions in Sway. What this means is you can use `if` expressions on the right side of a `let` statement to assign the outcome to a variable.

```sway
let my_data = if some_bool < 10 { foo() } else { bar() };
```

Note that all branches of the `if` expression must return a value of the same type.

### `match` expressions

<!-- This section should explain `match` expressions in Sway -->
<!-- match:example:start -->
Sway supports advanced pattern matching through exhaustive `match` expressions. Unlike an `if` expression, a `match` expression asserts **at compile time** that all possible patterns have been matched. If you don't handle all the patterns, you will get compiler error indicating that your `match` expression is non-exhaustive.
<!-- match:example:end -->

The basic syntax of a `match` expression is as follows:

```sway
let result = match expression {
    pattern1 => code_to_execute_if_expression_matches_pattern1,
    pattern2 => code_to_execute_if_expression_matches_pattern2,
    pattern3 | pattern4 => code_to_execute_if_expression_matches_pattern3_or_pattern4
    ...
    _ => code_to_execute_if_expression_matches_no_pattern,
}
```

Some examples of how you can use a `match` expression:

```sway
script;

// helper functions for our example
fn on_even(num: u64) {
    // do something with even numbers
}
fn on_odd(num: u64) {
    // do something with odd numbers
}

fn main(num: u64) -> u64 {
    // Match as an expression
    let is_even = match num % 2 {
        0 => true,
        _ => false,
    };

    // Match as control flow
    let x = 12;
    match x {
        5 => on_odd(x),
        _ => on_even(x),
    };

    // Match an enum
    enum Weather {
        Sunny: (),
        Rainy: (),
        Cloudy: (),
        Snowy: (),
    }
    let current_weather = Weather::Sunny;
    let avg_temp = match current_weather {
        Weather::Sunny => 80,
        Weather::Rainy => 50,
        Weather::Cloudy => 60,
        Weather::Snowy => 20,
    };

    let is_sunny = match current_weather {
        Weather::Sunny => true,
        Weather::Rainy | Weather::Cloudy | Weather::Snowy => false,
    };

    // match expression used for a return
    let outside_temp = Weather::Sunny;
    match outside_temp {
        Weather::Sunny => 80,
        Weather::Rainy => 50,
        Weather::Cloudy => 60,
        Weather::Snowy => 20,
    }
}
```

## Loops

### `while`

This is what a `while` loop looks like:

```sway
while counter < 10 {
    counter = counter + 1;
}
```

You need the `while` keyword, some condition (`value < 10` in this case) which will be evaluated each iteration, and a block of code inside the curly braces (`{...}`) to execute each iteration.

### `for`

This is what a `for` loop that computes the sum of a vector of numbers looks like:

```sway
for element in vector.iter() {
    sum += element;
}
```

You need the `for` keyword, some pattern that contains variable names such as `element` in this case, the `ìn` keyword followed by an iterator, and a block of code inside the curly braces (`{...}`) to execute each iteration. `vector.iter()` in the example above returns an iterator for the `vector`. In each iteration, the value of `element` is updated with the next value in the iterator until the end of the vector is reached and the `for` loop iteration ends.

Modifying the `vector` during iteration, by e.g. adding or removing elements, is a logical error and results in an [undefined behavior](../reference/undefined_behavior.md):

```sway
// The behavior of this `for` loop is undefined because
// the `vector` gets modified within the loop.
for element in vector.iter() {
    if element == 3 {
        vector.push(6); // Modification of the vector!
    }
}
```

### `break` and `continue`

`break` and `continue` keywords are available to use inside the body of a `while` or `for` loop. The purpose of the `break` statement is to break out of a loop early:

```sway
script;

// ANCHOR: break_example
fn break_example() -> u64 {
    let mut counter = 1;
    let mut sum = 0;
    let num = 10;
    while true {
        if counter > num {
            break;
        }
        sum += counter;
        counter += 1;
    }
    sum // 1 + 2 + .. + 10 = 55
}
// ANCHOR_END: break_example
// ANCHOR: continue_example
fn continue_example() -> u64 {
    let mut counter = 0;
    let mut sum = 0;
    let num = 10;
    while counter < num {
        counter += 1;
        if counter % 2 == 0 {
            continue;
        }
        sum += counter;
    }
    sum // 1 + 3 + .. + 9 = 25
}
// ANCHOR_END: continue_example
fn main() -> u64 {
    break_example() + continue_example() // 55 + 25 = 80
}
```

The purpose of the `continue` statement is to skip a portion of a loop in an iteration and jump directly into the next iteration:

```sway
script;

// ANCHOR: break_example
fn break_example() -> u64 {
    let mut counter = 1;
    let mut sum = 0;
    let num = 10;
    while true {
        if counter > num {
            break;
        }
        sum += counter;
        counter += 1;
    }
    sum // 1 + 2 + .. + 10 = 55
}
// ANCHOR_END: break_example
// ANCHOR: continue_example
fn continue_example() -> u64 {
    let mut counter = 0;
    let mut sum = 0;
    let num = 10;
    while counter < num {
        counter += 1;
        if counter % 2 == 0 {
            continue;
        }
        sum += counter;
    }
    sum // 1 + 3 + .. + 9 = 25
}
// ANCHOR_END: continue_example
fn main() -> u64 {
    break_example() + continue_example() // 55 + 25 = 80
}
```

### Nested loops

You can also use nested `while` loops if needed:

```sway
while condition_1 == true {
    // do stuff...
    while condition_2 == true {
        // do more stuff...
    }
}
```

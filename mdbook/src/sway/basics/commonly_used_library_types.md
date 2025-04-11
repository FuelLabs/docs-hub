# Commonly Used Library Types

The Sway Standard Library is the foundation of portable Sway software, a set of minimal shared abstractions for the broader Sway ecosystem. It offers core types, library-defined operations on language primitives, native asset management, blockchain contextual operations, access control, storage management, and support for types from other VMs, among many other things. Reference the standard library docs [here](https://fuellabs.github.io/sway/master/std/index.html).

## `Result<T, E>`

<!-- This section should explain what the `Result` type is -->
<!-- result:example:start -->
Type `Result` is the type used for returning and propagating errors. It is an `enum` with two variants: `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error and containing an error value. The `T` and `E` in this definition are type parameters, allowing `Result` to be generic and to be used with any types.
<!-- result:example:end -->

```sway
/// `Result` is a type that represents either success (`Ok`) or failure (`Err`).
pub enum Result<T, E> {
    /// Contains the success value.
    Ok: T,
    /// Contains the error value.
    Err: E,
}
```

<!-- This section should explain when to use the `Result` type -->
<!-- use_result:example:start -->
Functions return `Result` whenever errors are expected and recoverable.
<!-- use_result:example:end -->

Take the following example:

```sway
script;

enum MyContractError {
    DivisionByZero: (),
}

fn divide(numerator: u64, denominator: u64) -> Result<u64, MyContractError> {
    if (denominator == 0) {
        return Err(MyContractError::DivisionByZero);
    } else {
        Ok(numerator / denominator)
    }
}

fn main() -> Result<u64, str[4]> {
    let result = divide(20, 2);
    match result {
        Ok(value) => Ok(value),
        Err(MyContractError::DivisionByZero) => Err(__to_str_array("Fail")),
    }
}
```

## `Option<T>`

<!-- This section should explain the `Option` type -->
<!-- option:example:start -->
Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not. `Option` types are very common in Sway code, as they have a number of uses:

- Initial values where `None` can be used as an initializer.
- Return value for otherwise reporting simple errors, where `None` is returned on error.

The implementation of `Option` matches on the variant: if it's `Ok` it returns the inner value, if it's `None`, it [reverts](https://github.com/FuelLabs/fuel-specs/blob/master/src/fuel-vm/instruction-set.md#rvrt-revert).
<!-- option:example:end -->

```sway
/// A type that represents an optional value, either `Some(val)` or `None`.
pub enum Option<T> {
    /// No value.
    None: (),
    /// Some value of type `T`.
    Some: T,
}
```

<!-- This section should explain when to use the `Option` type -->
<!-- use_option:example:start -->
`Option` is commonly paired with pattern matching to query the presence of a value and take action, allowing developers to choose how to handle the `None` case.
<!-- use_option:example:end -->

Below is an example that uses pattern matching to handle invalid divisions by 0 by returning an `Option`:

```sway
script;

fn divide(numerator: u64, denominator: u64) -> Option<u64> {
    if denominator == 0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

fn main() {
    let result = divide(6, 2);
    // Pattern match to retrieve the value
    match result {
        // The division was valid
        Some(x) => std::logging::log(x),
        // The division was invalid
        None => std::logging::log("Cannot divide by 0"),
    }
}
```

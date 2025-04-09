# Commonly Used Library Types

The Sway Standard Library is the foundation of portable Sway software, a set of minimal shared abstractions for the broader Sway ecosystem. It offers core types, library-defined operations on language primitives, native asset management, blockchain contextual operations, access control, storage management, and support for types from other VMs, among many other things. Reference the standard library docs [here](https://fuellabs.github.io/sway/master/std/index.html).

## `Result<T, E>`

<!-- This section should explain what the `Result` type is -->
<!-- result:example:start -->
Type `Result` is the type used for returning and propagating errors. It is an `enum` with two variants: `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error and containing an error value. The `T` and `E` in this definition are type parameters, allowing `Result` to be generic and to be used with any types.
<!-- result:example:end -->

```sway
//! Error handling with the `Result` type.
//!
//! `Result<T, E>` `Result` is the type used for returning and propagating
//! errors. It is an enum with the variants, `Ok(T)`, representing
//! success and containing a value, and `Err(E)`, representing error
//! and containing an error value.
//!
//! Functions return `Result` whenever errors are expected and recoverable. In
//! the `std` crate, `Result` is most prominently used for `Identity`
//! interactions and cryptographic operations.
//!
//! A simple function returning `Result` might be defined and used like so:
//!
//! ```
//! enum Version {
//!     Version1,
//!     Version2,
//! }
//!
//! enum VersionError {
//!     InvalidNumber,
//! }
//!
//! fn parse_version(version_number: u8) -> Result<Version, VersionError> {
//!     match version_number {
//!         1 => Ok(Version::Version1),
//!         2 => Ok(Version::Version2),
//!         _ => Err(VersionError::InvalidNumber),
//!     }
//! }
//! ```
//!
//! ### Method overview
//!
//! In addition to working with pattern matching, `Result` provides a variety
//! of methods.
//!
//! ### Querying the variant
//!
//! The `is_ok` and `is_err` methods return `true` if the `Result` is
//! `Ok` or `Err`, respectively.
//!
//! `is_ok` : `Result::is_ok`
//! `is_err`: `Result::is_err`
//!
//! ### Extracting the contained value
//!
//! These methods extract the contained value in a `Result<T,E>` when it is
//! the `Ok` variant. If the `Result` is `Err`:
//!
//! * `unwrap` reverts.
//! * `unwrap_or` returns the default provided value.
//!
//! `unwrap`   : `Result::unwrap`
//! `unwrap_or`: `Result::unwrap_or`
library;

use ::logging::log;
use ::revert::revert;
use ::codec::*;
use ::ops::*;

// ANCHOR: docs_result
/// `Result` is a type that represents either success (`Ok`) or failure (`Err`).
pub enum Result<T, E> {
    /// Contains the success value.
    Ok: T,
    /// Contains the error value.
    Err: E,
}
// ANCHOR_END: docs_result


// Type implementation
//
impl<T, E> Result<T, E> {
    // Querying the contained values
    //
    /// Returns whether a result contains a success value.
    ///
    /// # Returns
    ///
    /// * [bool] - Returns `true` if the result is `Ok`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// enum Error {
    ///     NotFound,
    ///     Invalid,
    /// }
    ///
    /// fn foo() {
    ///     let x: Result<u64, Error> = Result::Ok(42);
    ///     assert(x.is_ok());
    ///
    ///     let y: Result<u64, Error> = Result::Err(Error::NotFound));
    ///     assert(!y.is_ok());
    /// }
    /// ```
    pub fn is_ok(self) -> bool {
        match self {
            Self::Ok(_) => true,
            _ => false,
        }
    }

    /// Returns whether a result contains an error value.
    ///
    /// # Returns
    ///
    /// * [bool] - Returns `true` if the result is `Err`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// enum Error {
    ///     NotFound,
    ///     Invalid,
    /// }
    ///
    /// fn foo() {
    ///     let x: Result<u64, Error> = Result::Ok(42);
    ///     assert(!x.is_err());
    ///
    ///     let y: Result<u64, Error> = Result::Err(Error::NotFound));
    ///     assert(y.is_err());
    /// }
    /// ```
    pub fn is_err(self) -> bool {
        match self {
            Self::Ok(_) => false,
            _ => true,
        }
    }

    /// Returns the contained `Ok` value, consuming the `self` value.
    ///
    /// # Additional Information
    ///
    /// Because this function may revert, its use is generally discouraged.
    /// Instead, prefer to use pattern matching and handle the `Err`
    /// case explicitly.
    ///
    /// # Returns
    ///
    /// * [T] - The value contained by the result.
    ///
    /// # Reverts
    ///
    /// * Reverts if the `Result` is the `Err` variant.
    ///
    /// # Examples
    ///
    /// ```sway
    /// enum Error {
    ///     NotFound,
    ///     Invalid,
    /// }
    ///
    /// fn foo() {
    ///     let x: Result<u64, Error> = Result::Ok(42);
    ///     assert(x.unwrap() == 42);
    ///
    ///     let y: Result<u64, Error> = Result::Err(Error::NotFound));
    ///     let val = y.unwrap(); // reverts
    /// }
    /// ```
    pub fn unwrap(self) -> T {
        match self {
            Self::Ok(inner_value) => inner_value,
            _ => revert(0),
        }
    }

    /// Returns the contained `Ok` value or a provided default.
    ///
    /// # Arguments
    ///
    /// * `default`: [T] - The value that is the default.
    ///
    /// # Returns
    ///
    /// * [T] - The value of the result or the default.
    ///
    /// # Examples
    ///
    /// ```sway
    /// enum Error {
    ///     NotFound,
    ///     Invalid,
    /// }
    ///
    /// fn foo() {
    ///     let x: Result<u64, Error> = Result::Ok(42);
    ///     assert(x.unwrap_or(69) == 42);
    ///
    ///     let y: Result<u64, Error> = Result::Err(Error::NotFound));
    ///     assert(y.unwrap_or(69) == 69);
    /// }
    /// ```
    pub fn unwrap_or(self, default: T) -> T {
        match self {
            Self::Ok(inner_value) => inner_value,
            Self::Err(_) => default,
        }
    }

    /// Returns the contained `Ok` value, consuming the `self` value.
    /// If the `Result` is the `Err` variant, logs the provided message, along with the error value.
    ///
    /// # Additional Information
    ///
    /// Because this function may revert, its use is generally discouraged.
    /// Instead, prefer to use pattern matching and handle the `Err`
    /// case explicitly.
    ///
    /// # Arguments
    ///
    /// * `msg`: [M] - The message to be logged if the `Result` is the `Err` variant.
    ///
    /// # Returns
    ///
    /// * [T] - The value contained by the result.
    ///
    /// # Reverts
    ///
    /// * Reverts if the `Result` is the `Err` variant.
    ///
    /// # Examples
    ///
    /// ```sway
    /// enum Error {
    ///     NotFound,
    ///     Invalid,
    /// }
    ///
    /// fn foo() {
    ///     let x: Result<u64, Error> = Result::Ok(42);
    ///     assert(x.expect("X is known to be 42") == 42);
    ///
    ///     let y: Result<u64, Error> = Result::Err(Error::NotFound));
    ///     let val = y.expect("Testing expect"); // reverts with `("Testing Expect", "Error::NotFound")`
    /// }
    /// ```
    ///
    /// # Recommended Message Style
    ///
    /// We recommend that `expect` messages are used to describe the reason you *expect* the `Result` should be `Ok`.
    ///
    /// ```sway
    /// let x: Result<u64, Error> = bar(1);
    /// let value = x.expect("bar() should never return Err with 1 as an argument");
    /// ```
    pub fn expect<M>(self, msg: M) -> T
    where
        M: AbiEncode,
        E: AbiEncode,
    {
        match self {
            Self::Ok(v) => v,
            Self::Err(err) => {
                log((msg, err));
                revert(0);
            },
        }
    }

    // TODO: Implement the following transforms when Option and Result can
    // import one another:
    // - `ok(self) -> Option<T>`
    // - `err(self) -> Option<E>`
}

impl<T, E> PartialEq for Result<T, E>
where
    T: PartialEq,
    E: PartialEq,
{
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (Self::Ok(a), Self::Ok(b)) => a == b,
            (Self::Err(a), Self::Err(b)) => a == b,
            _ => false,
        }
    }
}
impl<T, E> Eq for Result<T, E>
where
    T: Eq,
    E: Eq,
{}
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
//! A type for optional values.
//!
//! Type `Option` represents an optional value: every `Option`
//! is either `Some` and contains a value, or `None`, and
//! does not. `Option` types are very common in Sway code, as
//! they have a number of uses:
//!
//! * Initial values where `None` can be used as an initializer.
//! * Return value for otherwise reporting simple errors, where `None` is
//!   returned on error.
//! * Optional struct fields.
//! * Optional function arguments.
//!
//! `Option`s are commonly paired with pattern matching to query the presence
//! of a value and take action, always accounting for the `None` case.
//!
//! ```
//! fn divide(numerator: u64, denominator: u64) -> Option<u64> {
//!     if denominator == 0 {
//!         None
//!     } else {
//!         Some(numerator / denominator)
//!     }
//! }
//!
//! fn call_divide() {
//!     // The return value of the function is an option
//!     let result = divide(6, 2);
//!
//!     // Pattern match to retrieve the value
//!     match result {
//!         // The division was valid
//!         Some(x) => std::logging::log(x),
//!         // The division was invalid
//!         None    => std::logging::log("Cannot divide by 0"),
//!     }
//! }
//! ```
//!
//! # Method overview
//!
//! In addition to working with pattern matching, `Option` provides a wide
//! variety of different methods.
//!
//! # Querying the variant
//!
//! The `is_some` and `is_none` methods return `true` if the `Option`
//! is `Some` or `None`, respectively.
//!
//! `is_none`: `Option::is_none`
//! `is_some`: `Option::is_some`
//!
//! # Extracting the contained value
//!
//! These methods extract the contained value in an `Option<T>` when it
//! is the `Some` variant. If the `Option` is `None`:
//!
//! * `unwrap` reverts.
//! * `unwrap_or` returns the provided default value.
//!
//! `unwrap`   : `Option::unwrap`
//! `unwrap_or`: `Option::unwrap_or`
//!
//! # Transforming contained values
//!
//! These methods transform `Option` to `Result`:
//!
//! * `ok_or` transforms `Some(v)` to `Ok(v)`, and `None` to
//!   `Err(e)` using the provided default error value.
//!
//! `Err(e)` : `Result::Err`
//! `Ok(v)`  : `Result::Ok`
//! `Some(v)`: `Option::Some`
//! `ok_or`  : `Option::ok_or`
library;

use ::logging::log;
use ::result::Result;
use ::revert::revert;
use ::codec::*;
use ::ops::*;

// ANCHOR: docs_option
/// A type that represents an optional value, either `Some(val)` or `None`.
pub enum Option<T> {
    /// No value.
    None: (),
    /// Some value of type `T`.
    Some: T,
}
// ANCHOR_END: docs_option

impl<T> PartialEq for Option<T>
where
    T: PartialEq,
{
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (Option::Some(a), Option::Some(b)) => a == b,
            (Option::None, Option::None) => true,
            _ => false,
        }
    }
}
impl<T> Eq for Option<T>
where
    T: Eq,
{}

// Type implementation
//
impl<T> Option<T> {
    // Querying the contained values
    //
    /// Returns whether the option is the `Some` variant.
    ///
    /// # Returns
    ///
    /// * [bool] - Returns `true` if the option is `Some`, otherwise `false`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let x: Option<u32> = Some(2);
    ///     assert(x.is_some());
    ///
    ///     let x: Option<u32> = None;
    ///     assert(!x.is_some());
    /// }
    /// ```
    pub fn is_some(self) -> bool {
        match self {
            Self::Some(_) => true,
            _ => false,
        }
    }

    /// Returns whether the option is the `None` variant.
    ///
    /// # Returns
    ///
    /// * [bool] - Returns `true` if the option is `None`, otherwise `false`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let x: Option<u32> = Some(2);
    ///     assert(!x.is_none());
    ///
    ///     let x: Option<u32> = None;
    ///     assert(x.is_none());
    /// }
    /// ```
    pub fn is_none(self) -> bool {
        match self {
            Self::Some(_) => false,
            _ => true,
        }
    }

    // Getting to contained values
    //
    /// Returns the contained `Some` value, consuming the `self` value.
    ///
    /// # Additional Information
    ///
    /// Because this function may revert, its use is generally discouraged.
    /// Instead, use pattern matching and handle the `None`
    /// case explicitly, or call `unwrap_or`.
    ///
    /// # Returns
    ///
    /// * [T] - The value contained by the option.
    ///
    /// # Reverts
    ///
    /// * Reverts if the `Option` is the `None` variant.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let x = Some(42);
    ///     assert(x.unwrap() == 42);
    /// }
    /// ```
    ///
    /// ```sway
    /// fn foo() {
    ///     let x: Option<u64> = None;
    ///     let value = x.unwrap(); // reverts
    /// }
    /// ```
    pub fn unwrap(self) -> T {
        match self {
            Self::Some(inner_value) => inner_value,
            _ => revert(0),
        }
    }

    /// Returns the contained `Some` value or a provided default.
    ///
    /// # Arguments
    ///
    /// * `default`: [T] - The default value the function will revert to.
    ///
    /// # Returns
    ///
    /// * [T] - The contained value or the default value.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     assert(Some(42).unwrap_or(69) == 42);
    ///     assert(None::<u64>().unwrap_or(69) == 69);
    /// }
    /// ```
    pub fn unwrap_or(self, default: T) -> T {
        match self {
            Self::Some(x) => x,
            Self::None => default,
        }
    }

    // Transforming contained values
    //
    /// Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
    /// `Ok(v)` and `None` to `Err(e)`.
    ///
    /// # Additional Information
    ///
    /// `Ok(v)`  : `Result::Ok`
    /// `Err(e)` : `Result::Err`
    /// `Some(v)`: `Option::Some`
    /// `ok_or`  : `Option::ok_or`
    ///
    /// # Arguments
    ///
    /// * `err`: [E] - The error value if the option is `None`.
    ///
    /// # Returns
    ///
    /// * [Result<T, E>] - The result containing the value or the error.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let x = Some(42);
    ///     match x.ok_or(0) {
    ///         Result::Ok(inner) => assert(inner == 42),
    ///         Result::Err => revert(0),
    ///     }
    ///
    ///     let x: Option<u64> = None;
    ///     match x.ok_or(0) {
    ///         Result::Ok(_) => revert(0),
    ///         Result::Err(e) => assert(e == 0),
    ///     }
    /// }
    /// ```
    pub fn ok_or<E>(self, err: E) -> Result<T, E> {
        match self {
            Self::Some(v) => Result::Ok(v),
            Self::None => Result::Err(err),
        }
    }

    /// Returns the contained `Some` value, consuming the `self` value.
    /// If the `Option` is the `None` variant, logs the provided message.
    ///
    /// # Additional Information
    ///
    /// Because this function may revert, its use is generally discouraged.
    /// Instead, prefer to use pattern matching and handle the `None`
    /// case explicitly.
    ///
    /// # Arguments
    ///
    /// * `msg`: [M] - The message to be logged if the `Option` is the `None` variant.
    ///
    /// # Returns
    ///
    /// * [T] - The value contained by the option.
    ///
    /// # Reverts
    ///
    /// * Reverts if the `Option` is the `None` variant.
    ///
    /// # Examples
    ///
    /// ```sway
    ///
    /// fn foo() {
    ///     let x: Option<u64> = Some(42);
    ///     assert(x.expect("X is known to be 42") == 42);
    ///
    ///     let y: Option<u64> = None;
    ///     let val = y.expect("Testing expect"); // reverts with `("Testing Expect")`
    /// }
    /// ```
    ///
    /// # Recommended Message Style
    ///
    /// We recommend that `expect` messages are used to describe the reason you *expect* the `Option` should be `Some`.
    ///
    /// ```sway
    /// let x: Option<u64> = bar(1);
    /// let value = x.expect("bar() should never return None with 1 as an argument");
    /// ```
    pub fn expect<M>(self, msg: M) -> T
    where
        M: AbiEncode,
    {
        match self {
            Self::Some(v) => v,
            Self::None => {
                log(msg);
                revert(0);
            },
        }
    }
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

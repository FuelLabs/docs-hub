# Library

Example on how to create a library in Sway and how to use it in your Smart Contract.
This example also showcases how to use different types of imports in Sway depending on external library or library from the same project.

```sway
contract;

// 1. Importing within the same project
// Using "mod" keyword, you can import an internal library that has been defined in this project.
mod sqrt_lib;

// It is a good practice to import in ABI
// It is also a good practice to define events and custom errors using this way

// Using "use" keyword imports in a library. This method is used to import an external lilbray that is defined outside the main `src` directory.
// use sqrt_lib::math_sqrt;
// $ tree
// .
// ├── my_project
// │   ├── Cargo.toml
// │   ├── Forc.toml
// │   └─── src
// │       └── main.sw
// │
// └── external_lib
//     ├── Cargo.toml
//     ├── Forc.toml
//     └─── src
//         └── lib.sw
// External library is outside the src directory of our project. Thus, it needs to be added as a dependency in the Forc.toml of our project.
// [dependencies]
// external_lib = { path = "../external_lib" }


// 2. Importing the standard library
// The standard library consists of
//   a. language primitives
//   b. blockchain contextual operations
//   c. native asset management
//   etc.
// Functions like msg.sender(), block.timestamp(),etc are found here https://github.com/FuelLabs/sway/tree/master/sway-lib-std
// use std::{
//     identity::*,
//     address::*,
//     constants::*,
//     auth::msg_sender,
// };


// 3. Importing from a different project
// If any library is not listed as a dependency, but present in forc.toml, you can use it as below.
// Math libraries copied from https://github.com/sway-libs/concentrated-liquidity/
// use math_lib::full_math::*;

use ::sqrt_lib::math_sqrt;

abi TestMath {
    fn test_square_root(x: u256) -> u256;
}

impl TestMath for Contract {
    fn test_square_root(x: u256) -> u256 {
        math_sqrt(x)
    }
}
```

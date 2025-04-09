# Imports

Examples of imports in Sway

```sway
contract;

// Imports
// - Internal
mod imports_library;
use imports_library::*;

// - External
use math_lib::full_math::*;

// - Standard library (std)
use std::{
    identity::*,
    auth::msg_sender,
};

// - Sway standards
use standards::src20::SRC20;

abi MyContract {
    fn test_function() -> bool;
}

impl MyContract for Contract {
    fn test_function() -> bool {
        true
    }
}
```

## Project Structures

### Internal

```bash

└── imports
    ├── Forc.toml
    └── src
        ├── imports_library.sw
        └── main.sw

```

### External

```bash

├── imports
│   ├── Forc.toml
│   └── src
│       ├── imports_library.sw
│       └── main.sw
└── math_lib
    ├── Forc.toml
    └── src
        ├── Q64x64.sw
        ├── full_math.sw
        └── math_lib.sw

```

All external imports must be defined as dependencies within `Forc.toml`

```toml
[project]
authors = ["Kin Chan"]
entry = "main.sw"
license = "Apache-2.0"
name = "imports"

[dependencies]
standards = { git = "https://github.com/FuelLabs/sway-standards", tag = "v0.5.1" }
math_lib = { path = "../math_lib/" }
```

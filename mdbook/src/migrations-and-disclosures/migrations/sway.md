# Sway Migrations Guide

## March 13, 2024

[Release v0.67.0](https://github.com/FuelLabs/sway/releases/tag/v0.67.0)

### New `forc migrate`

Below is a simplified example of how to migrate your project quickly. For more information on how to use `forc migrate` please refer to the [`forc migrate` docs](https://docs.fuel.network/docs/forc/plugins/forc_migrate/#forc-migrate).

> Important: Using `forc migrate` requires you to use the version of Sway right before the breaking change version.

For example, breaking changes for Sway will come in version `v0.67.0`, you will need to use `v0.66.10` to run `forc migrate`, in order to migrate properly.

You can compile and migrate using the previous latest version by running the following command:

```bash
fuelup component add forc@0.66.10
```

#### 1. Run `forc migrate show`

Running `forc migrate show` will inform you about all the breaking changes in the next release. For example:

```sh
Breaking change features:
  - storage_domains            (https://github.com/FuelLabs/sway/issues/6701)
  - partial_eq                 (https://github.com/FuelLabs/sway/issues/6883)
  - try_from_bytes_for_b256    (https://github.com/FuelLabs/sway/issues/6994)
  - merge_core_std             (https://github.com/FuelLabs/sway/issues/7006)

Migration steps (1 manual, 3 semiautomatic, and 3 automatic):
storage_domains
  [M] Review explicitly defined slot keys in storage declarations (`in` keywords)
  [S] Explicitly define storage slot keys if they need to be backward compatible

partial_eq
  [A] Implement experimental `PartialEq` and `Eq` traits
  [S] Remove deprecated `Eq` trait implementations and `experimental_partial_eq` attributes

try_from_bytes_for_b256
  [A] Replace `b256::from(<bytes>)` calls with `b256::try_from(<bytes>).unwrap()`
  [A] Replace `<bytes>.into()` calls with `<bytes>.try_into().unwrap()`

merge_core_std
  [S] Replace `core` with `std` in paths

Experimental feature flags:
- for Forc.toml:  experimental = { storage_domains = true, partial_eq = true, try_from_bytes_for_b256 = true, merge_core_std = true }
- for CLI:        --experimental storage_domains,partial_eq,try_from_bytes_for_b256,merge_core_std
```

#### 2. Update `forc.toml` dependencies

In your Sway project, update the `forc.toml` file to use the previous latest version of Sway.

```toml
// before

[dependencies]
standards = { git = "https://github.com/FuelLabs/sway-standards", tag = "v0.6.1" }
sway_libs = { git = "https://github.com/FuelLabs/sway-libs", tag = "v0.24.0" }
```

```toml
// after

[dependencies]
standards = { git = "https://github.com/FuelLabs/sway-standards", tag = "v0.6.3" }
sway_libs = { git = "https://github.com/FuelLabs/sway-libs", tag = "v0.24.2" }
```

#### 3. Run `forc migrate run`

Running `forc migrate run` walks you through each of the breaking changes and helps you apply them to your project.
If you just want to see the breaking changes in your project without migrating them, you can run `forc migrate check`.

```sh
   Compiling mira_amm_contract (/mira-v1-core/contracts/mira_amm_contract)
warning: unused manifest key: build-profile.?.release.experimental
   Migrating Breaking change feature storage_domains
     Checked [storage_domains]  Review explicitly defined slot keys in storage declarations (`in` keywords)
      Review [storage_domains]  Explicitly define storage slot keys if they need to be backward compatible
info: [storage_domains] Explicitly define storage slot keys if they need to be backward compatible
  --> /mira-v1-core/contracts/mira_amm_contract/src/main.sw:65:1
   |
63 |   
64 |   
65 | / storage {
66 | |     /// Pools storage
...  |
79 | |     hook: Option<ContractId> = None,
80 | | }
   | |_-
   |
   = help: If the contract owning this storage is behind a proxy, or for any other reason needs
   = help: to use previous storage slot keys, those keys must be explicitly assigned to the
   = help: storage fields by using the `in` keyword.
   = help:  
   = help: E.g.:
   = help:     storage {
   = help:         field in <previous slot key>: u64 = 0,
   = help:     }
   = help:  
   = help: The previous formula for calculating storage keys was: `sha256("storage.<field name>")`.
   = help: The new formula is:                                    `sha256((0u8, "storage.<field name>"))`.
   = help:  
   = help: This migration step will interactively modify the code, based on your input.
   = help:  
   = help: For a detailed migration guide see: https://github.com/FuelLabs/sway/issues/6701
____

The following storage fields will have slot keys calculated by using the new formula:
  - storage.pools
  - storage.total_pools
  - storage.total_reserves
  - storage.lp_total_supply
  - storage.lp_name
  - storage.protocol_fees
  - storage.hook

Do you want these fields to have backward compatible storage slot keys, calculated
by using the previous formula?

If yes, this migration step will insert `in` keywords to all of the above fields,
and calculate the storage slot keys by using the previous formula.

1. Yes, assign the backward compatible storage slot keys.
2. No, this contract does not require backwards compatibility.
Enter your choice [1..2]: 1
    Changing [storage_domains]  Explicitly define storage slot keys if they need to be backward compatible
Source code successfully changed (7 changes).
    Finished Project is compatible with the next breaking change version of Sway
```

#### 4. Switch to the latest version of Sway

```sh
// Assuming you have 0.67.0 installed
fuelup default latest
```

#### 5. Compile your project

```sh
forc build
```

> Using the `forc migrate` tool is highly recommended, and the changes below are only for reference.

### Compiler/std-lib: storage collison between variables and StorageMap, allows hidden backdoors, likely loss of funds - [#6701](https://github.com/FuelLabs/sway/issues/6701)

Certain storage types, like, e.g., `StorageMap` allow storage slots of their contained elements to be defined based on developer's input. E.g., the key in a `StorageMap` used to calculate the storage slot is a developer input.

To ensure that pre-images of such storage slots can never be the same as a pre-image of compiler generated key of a storage field, we will prefix the pre-images of storage fields with a single byte that denotes the storage field domain. Storage types like `StorageMap` must have a different domain prefix than this storage field domain which will be set to 0u8.

```sway
// before
sha256("storage::<optional namespace 1>::<optional namespace 2>.<field name>")
```

```sway
// after
sha256((0u8, "storage::<optional namespace 1>::<optional namespace 2>.<field name>"))
```

If the contract owning the storage is behind a proxy, its storage field keys must be backward compatible and the same as the old keys. In this, and any other case where the backward compatibility of the storage slot keys is needed, the old keys must be explicitly defined for storage fields, by using the in keyword and the old keys.

E.g., assume we have a contract with the following storage behind a proxy:

```sway
// before
storage {
    x: u64 = 0,
    namespace_1 {
        y: u64 = 0,
        namespace_2 {
            z: u64 = 0,
        }
    }
}
```

```sway
// after
storage {
    x in 0xc979570128d5f52725e9a343a7f4992d8ed386d7c8cfd25f1c646c51c2ac6b4b: u64 = 0,
    namespace_1 {
        y in 0x2f055029200cd7fa6751421635c722fcda6ed2261de0f1e0d19d7f257e760589: u64 = 0,
        namespace_2 {
            z in 0x03d2ee7fb8f3f5e1084e86b02d9d742ede96559e44875c6210c7008e2d184694: u64 = 0,
        }
    }
}
```

### Replace `Eq` trait implementations with `PartialEq` and `Eq` implementations - [#6883](https://github.com/FuelLabs/sway/issues/6883)

Partial equivalence feature renames the current `Eq` trait to `PartialEq` and adds a new, empty `Eq` trait with `PartialEq` as a supertrait.

Every existing `Eq` trait implementation needs to be renamed to `PartialEq`, and in addition, an empty `Eq` implementations needs to be added.

```sway
// before
impl Eq for SomeType {
    fn eq(self, other: Self) -> bool {
        self.x == other.x
    }
}
```

```sway
// after
impl PartialEq for SomeType {
    fn eq(self, other: Self) -> bool {
        self.x == other.x
    }
}

impl Eq for SomeType {}
```

If the original implementation implements Eq for a generic type and in addition has Eq on trait constraints, those Eq trait constraints must be replaced by PartialEq in the new PartialEq impl, and remain Eq in the new, empty, Eq impl.

```sway
// before
impl<A, B> Eq for (A, B)
where
    A: Eq,
    B: Eq,
{
    fn eq(self, other: Self) -> bool {
        self.0 == other.0 && self.1 == other.1
    }
}
```

```sway
// after
impl<A, B> PartialEq for (A, B)
where
    A: PartialEq,
    B: PartialEq,
{
    fn eq(self, other: Self) -> bool {
        self.0 == other.0 && self.1 == other.1
    }
}

impl<A, B> Eq for (A, B)
where
    A: Eq,
    B: Eq,
{}
```

### Implement `TryFrom<Bytes>` for `b256` - [#6994](https://github.com/FuelLabs/sway/issues/6994)

Replace calls to `from(bytes)/bytes.into()` with `try_from(bytes)/bytes.try_into()`.

Calls to `from`:

```sway
// before
let result = b256::from(some_bytes);
```

```sway
// after
let result = b256::try_from(some_bytes).unwrap();
```

Calls to `into`:

```sway
// before
let result = some_bytes.into();
```

```sway
// after
let result = some_bytes.try_into().unwrap();
```

### Merge `core` and `std` libraries - [#7006](https://github.com/FuelLabs/sway/issues/7006)

Currently, we have two standard libraries, `core` and `std`. The distinction between them is rather arbitrary, and we want to merge them into a single library called `std`. All the existing modules in the `core` library will be moved to the `std` library, but their content will not be changed.

```sway
// before
use core::ops::*;

impl core::ops::Eq for SomeType {
    fn eq(self, other: Self) -> bool {
        self.x == other.x
    }
}

let _ = core::codec::encode(0u64);
```

```sway
// after
use std::ops::*;

impl std::ops::Eq for SomeType {
    fn eq(self, other: Self) -> bool {
        self.x == other.x
    }
}

let _ = std::codec::encode(0u64);
```

## August 16, 2024

[Release v0.63.0](https://github.com/FuelLabs/sway/releases/tag/v0.63.0)

### `#[namespace()]` attribute is no longer supported - [#6279](https://github.com/FuelLabs/sway/pull/6279)

We no longer support the `#[namespace()]` attribute.  If you use it, notably with SRC14, you should migrate to using the `in` keyword if you want backwards compatibility.  If you just care about namespacing, you should use the new namespacing syntax.

Backwards compatibility places `foo` at `sha256("storage_example_namespace_0")`

```sway
// before
#[namespace(example_namespace)]
storage {
    foo: u64 = 0,
}
```

```sway
// after
storage {
    foo in 0x1102bf23d7c2114d6b409df4a1f8f7982eda775e800267be65c1cc2a93cb6c5c: u64 = 0,
}
```

New / recommended method places `foo` at `sha256("storage::example_namespace.foo")`

```sway
// new
storage {
    example_namespace {
        foo: u64 = 0,
    },
}
```

### Configurables are no longer allowed in pattern matching and shadowing - [#6289](https://github.com/FuelLabs/sway/pull/6289)

The code below does not compile any more.

```sway
configurable {
    X: u8 = 10,
}

fn main() {
    let X = 101u8; // ERROR: Variable "X" shadows configurable of the same name.
}
```

```sway
configurable {
    X: u8 = 10,
}

fn main() {
    match var {
        (0, X) => true // ERROR: "X" is a configurable and configurables cannot be matched against.
    }
}
```

### New ABI specification format - [#6254](https://github.com/FuelLabs/sway/pull/6254)

The new ABI specification format is hash based to improve support for indexing.  There were also updates to support the latest VM features.

### Added variable length message support when verifying ed signatures - [#6419](https://github.com/FuelLabs/sway/pull/6419)

`ed_verify` was changed to use `Bytes` for the message instead of `b256` for a message hash.

```sway
// before
pub fn ed_verify(public_key: b256, signature: B512, msg_hash: b256)
```

```sway
// after
pub fn ed_verify(public_key: b256, signature: B512, msg: Bytes)
```

### Some STD functions now return an `Option` instead of reverting - [#6405](https://github.com/FuelLabs/sway/pull/6405), [#6414](https://github.com/FuelLabs/sway/pull/6414), [#6418](https://github.com/FuelLabs/sway/pull/6418)

Some functions in the STD now return an `Option` instead of reverting.  This allows developers to fail gracefully.  More functions will do this in the future.

```sway
// before
let my_predicate_address: Address = predicate_address();
```

```sway
// after
let my_predicate_address: Address = predicate_address().unwrap();
```

### Some STD functions now return types have been updated to match the Fuel Specifications

- `output_count()` now returns a `u16` over a `u64`

Before:

```sway
let output_count: u64 = output_count();
```

After:

```sway
let my_output_count: u16 = output_count();
```

- `tx_maturity` now returns an `Option<u32>` over an `Option<u64>`

Before:

```sway
let my_tx_maturity: u64 = tx_maturity().unwrap()
```

After:

```sway
let my_tx_maturity: u32 = tx_maturity().unwrap()
```

### Some STD functions have been made private. These will no longer be available for developers to use

- `input_pointer()`
- `output_pointer()`
- `tx_witness_pointer()`
- `tx_script_start_pointer()`
- `tx_script_data_start_pointer()`

The following functions now follow this format:

Inputs:

- `input_type()`
- `input_predicate_data()`
- `input_predicate()`
- `input_message_sender()`
- `input_message_recipient()`
- `input_message_data_length()`
- `input_message_data()`
- `input_message_nonce()`

Outputs:

- `output_type()`
- `output_amount()`

Transactions:

- `tx_script_length()`
- `tx_script_data_length()`
- `tx_witness_data_length()`
- `tx_witness_data()`
- `tx_script_data()`
- `tx_script_bytecode()`
- `tx_script_bytecode_hash()`

### Non-breaking Changes

New partial support for slices.

Automated proxy creation and deployment with forc.

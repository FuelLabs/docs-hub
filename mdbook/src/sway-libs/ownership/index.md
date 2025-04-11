# Ownership Library

The **Ownership Library** provides a straightforward way to restrict specific calls in a Sway contract to a single _owner_. Its design follows the [SRC-5](https://docs.fuel.network/docs/sway-standards/src-5-ownership/) standard from [Sway Standards](https://docs.fuel.network/docs/sway-standards/) and offers a set of functions to initialize, verify, revoke, and transfer ownership.

For implementation details, visit the [Sway Libs Docs](https://fuellabs.github.io/sway-libs/master/sway_libs/ownership/index.html).

## Importing the Ownership Library

1. **Add Sway Libs to `Forc.toml`**  
   Please see the [Getting Started](../getting_started/index.md) guide for instructions on adding **Sway Libs** as a dependency.

2. **Add Sway Standards to `Forc.toml`**  
   Refer to the [Sway Standards Book](https://docs.fuel.network/docs/sway-standards/#using-a-standard) to add **Sway Standards**.

3. **Import the Ownership Library**  
   To import the Ownership Library and the [SRC-5](https://docs.fuel.network/docs/sway-standards/src-5-ownership/) standard, include the following in your Sway file:

   ```sway
   use sway_libs::ownership::*;
use standards::src5::*;
   ```

## Integrating the Ownership Library into the SRC-5 Standard

When integrating the Ownership Library with [SRC-5](https://docs.fuel.network/docs/sway-standards/src-5-ownership/), ensure that the `SRC5` trait from **Sway Standards** is implemented in your contract, as shown below. The `_owner()` function from this library is used to fulfill the SRC-5 requirement of exposing the ownership state.

```sway
use sway_libs::ownership::_owner;
use standards::src5::{SRC5, State};

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}
```

## Basic Usage

### Setting a Contract Owner

Establishes the initial ownership state by calling `initialize_ownership(new_owner)`. This can only be done once, typically in your contract's constructor.

```sway
#[storage(read, write)]
fn my_constructor(new_owner: Identity) {
    initialize_ownership(new_owner);
}
```

### Applying Restrictions

Protect functions so only the owner can call them by invoking `only_owner()` at the start of those functions.

```sway
#[storage(read)]
fn only_owner_may_call() {
    only_owner();
    // Only the contract's owner may reach this line.
}
```

### Checking the Ownership Status

To retrieve the current ownership state, call `_owner()`.

```sway
#[storage(read)]
fn get_owner_state() {
    let owner: State = _owner();
}
```

### Transferring Ownership

To transfer ownership from the current owner to a new owner, call `transfer_ownership(new_owner)`.

```sway
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'transfer_ownership' not found in '../../../../examples/ownership/src/lib.sw' -->
```

### Renouncing Ownership

To revoke ownership entirely and disallow the assignment of a new owner, call `renounce_ownership()`.

```sway
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'renouncing_ownership' not found in '../../../../examples/ownership/src/lib.sw' -->
```

## Events

### `OwnershipRenounced`

Emitted when ownership is revoked.

- **Fields:**
  - `previous_owner`: Identity of the owner prior to revocation.

### `OwnershipSet`

Emitted when initial ownership is set.

- **Fields:**
  - `new_owner`: Identity of the newly set owner.

### `OwnershipTransferred`

Emitted when ownership is transferred from one owner to another.

- **Fields:**
  - `new_owner`: Identity of the new owner.
  - `previous_owner`: Identity of the prior owner.

## Errors

### `InitializationError`

- **Variants:**
  - `CannotReinitialized`: Thrown when attempting to initialize ownership if the owner is already set.

### `AccessError`

- **Variants:**
  - `NotOwner`: Thrown when a function restricted to the owner is called by a non-owner.

## Example Integration

Below is a example illustrating how to use this library within a Sway contract:

```sway
<!-- MDBOOK-ANCHOR-ERROR: Anchor 'example_contract' not found in '../../../../examples/ownership/src/main.sw' -->
```

1. **Initialization:** Call `constructor(new_owner)` once to set the initial owner.  
2. **Restricted Calls:** Use `only_owner()` to guard any owner-specific functions.  
3. **Ownership Checks:** Retrieve the current owner state via `_owner()`.  
4. **Transfer or Renounce:** Use `transfer_ownership(new_owner)` or `renounce_ownership()` for ownership modifications.

# Admin Library

The Admin library provides a way to block users without an "administrative status" from calling functions within a contract. The Admin Library differs from the [Ownership Library](../ownership/index.md) as multiple users may have administrative status. The Admin Library is often used when needing administrative calls on a contract that involve multiple users or a whitelist.

This library extends the [Ownership Library](../ownership/index.md). The Ownership library must be imported and used to enable the Admin library. Only the contract's owner may add and remove administrative users.

For implementation details on the Admin Library please see the [Sway Libs Docs](https://fuellabs.github.io/sway-libs/master/sway_libs/admin/index.html).

## Importing the Admin Library

In order to use the Admin Library, Sway Libs must be added to the `Forc.toml` file and then imported into your Sway project. To add Sway Libs as a dependency to the `Forc.toml` file in your project please see the [Getting Started](../getting_started/index.md).

To import the Admin Library, be sure to include both the Admin and Ownership Libraries in your import statements.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

## Integrating the Admin Library into the Ownership Library

To use the Admin library, be sure to set a contract owner for your contract. The following demonstrates setting a contract owner using the [Ownership Library](../ownership/).

```sway
```sway\nlibrary;

// ANCHOR: ownership_integration
use sway_libs::{admin::add_admin, ownership::initialize_ownership};

#[storage(read, write)]
fn my_constructor(new_owner: Identity) {
    initialize_ownership(new_owner);
}

#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner set in the constructor above.
    add_admin(new_admin);
}
// ANCHOR_END: ownership_integration\n```
```

## Basic Functionality

### Adding an Admin

To add a new admin to a contract, call the `add_admin()` function.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

> **NOTE** Only the contract's owner may call this function. Please see the example above to set a contract owner.

### Removing an Admin

To remove an admin from a contract, call the `revoke_admin()` function.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

> **NOTE** Only the contract's owner may call this function. Please see the example above to set a contract owner.

### Applying Restrictions

To restrict a function to only an admin, call the `only_admin()` function.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

> **NOTE:** Admins and the contract's owner are independent of one another. `only_admin()` will revert if called by the contract's owner.

To restrict a function to only an admin or the contract's owner, call the `only_owner_or_admin()` function.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

### Checking Admin Status

To check the administrative privileges of a user, call the `is_admin()` function.

```sway
```sway\nlibrary;

mod owner_integration;

// ANCHOR: import
use sway_libs::{admin::*, ownership::*};
// ANCHOR_END: import

// ANCHOR: add_admin
#[storage(read, write)]
fn add_a_admin(new_admin: Identity) {
    // Can only be called by contract's owner.
    add_admin(new_admin);
}
// ANCHOR_END: add_admin

// ANCHOR: remove_admin
#[storage(read, write)]
fn remove_an_admin(old_admin: Identity) {
    // Can only be called by contract's owner.
    revoke_admin(old_admin);
}
// ANCHOR_END: remove_admin

// ANCHOR: only_admin
#[storage(read)]
fn only_owner_may_call() {
    only_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: only_admin

// ANCHOR: both_admin
#[storage(read)]
fn both_owner_or_admin_may_call() {
    only_owner_or_admin();
    // Only an admin may reach this line.
}
// ANCHOR_END: both_admin

// ANCHOR: check_admin
#[storage(read)]
fn check_if_admin(admin: Identity) {
    let status = is_admin(admin);
    assert(status);
}
// ANCHOR_END: check_admin\n```
```

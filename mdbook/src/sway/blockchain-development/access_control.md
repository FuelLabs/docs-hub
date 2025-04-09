# Access Control

<!-- This section should explain access control in Sway -->
<!-- access_control:example:start -->
Smart contracts require the ability to restrict access to and identify certain users or contracts. Unlike account-based blockchains, transactions in UTXO-based blockchains (i.e. Fuel) do not necessarily have a unique transaction sender. Additional logic is needed to handle this difference, and is provided by the standard library.
<!-- access_control:example:end -->

## `msg_sender`

<!-- This section should explain what the `msg_sender` method is -->
<!-- msg_sender:example:start -->
To deliver an experience akin to the EVM's access control, the `std` library provides a `msg_sender` function, which identifies a unique caller based upon the call and/or transaction input data.
<!-- msg_sender:example:end -->

```sway
contract;

abi MyOwnedContract {
    fn receive(field_1: u64) -> bool;
}

const OWNER = Address::from(0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c);

impl MyOwnedContract for Contract {
    fn receive(field_1: u64) -> bool {
        let sender = msg_sender().unwrap();
        if let Identity::Address(addr) = sender {
            assert(addr == OWNER);
        } else {
            revert(0);
        }

        true
    }
}
```

<!-- This section should explain how the `msg_sender` method works -->
<!-- msg_sender_details:example:start -->
The `msg_sender` function works as follows:

- If the caller is a contract, then `Ok(Sender)` is returned with the `ContractId` sender variant.
- If the caller is external (i.e. from a script), then all coin input owners in the transaction are checked. If all owners are the same, then `Ok(Sender)` is returned with the `Address` sender variant.
- If the caller is external and coin input owners are different, then the caller cannot be determined and a `Err(AuthError)` is returned.
<!-- msg_sender_details:example:end -->

## Contract Ownership

Many contracts require some form of ownership for access control. The [SRC-5 Ownership Standard](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-5-ownership.md) has been defined to provide an interoperable interface for ownership within contracts.

To accomplish this, use the [Ownership Library](https://fuellabs.github.io/sway-libs/book/ownership/index.html) to keep track of the owner. This allows setting and revoking ownership using the variants `Some(..)` and `None` respectively. This is better, safer, and more readable than using the `Identity` type directly where revoking ownership has to be done using some magic value such as `b256::zero()` or otherwise.

- The following is an example of how to properly lock a function such that only the owner may call a function:

```sway
contract;

// SRC-5 Ownership Standard `State` enum
pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

// SRC-5 Ownership Standard `Ownership` struct
pub struct Ownership {
    state: State,
}

// Skeleton implementation of the Ownership Library.
// The library can be found here https://github.com/FuelLabs/sway-libs/tree/master/libs/ownership
impl StorageKey<Ownership> {
    fn renounce_ownership(self) {}
    fn set_ownership(self, identity: Identity) {}
    fn owner(self) -> State {
        State::Uninitialized
    }
    fn only_owner(self) {}
}

impl Ownership {
    fn initialized(identity: Identity) -> Self {
        Self {
            state: State::Initialized(identity),
        }
    }
}

abi OwnershipExample {
    #[storage(write)]
    fn revoke_ownership();
    #[storage(write)]
    fn set_owner(identity: Identity);
    #[storage(read)]
    fn owner() -> State;
    #[storage(read)]
    fn only_owner();
}

// ANCHOR: set_owner_example_storage
storage {
    owner: Ownership = Ownership::initialized(Identity::Address(Address::zero())),
}
// ANCHOR_END: set_owner_example_storage

impl OwnershipExample for Contract {
    // ANCHOR: revoke_owner_example
    #[storage(write)]
    fn revoke_ownership() {
        storage.owner.renounce_ownership();
    }
    // ANCHOR_END: revoke_owner_example
    // ANCHOR: set_owner_example_function
    #[storage(write)]
    fn set_owner(identity: Identity) {
        storage.owner.set_ownership(identity);
    }
    // ANCHOR_END: set_owner_example_function
    // ANCHOR: get_owner_example
    #[storage(read)]
    fn owner() -> State {
        storage.owner.owner()
    }
    // ANCHOR_END: get_owner_example
    // ANCHOR: only_owner_example
    #[storage(read)]
    fn only_owner() {
        storage.owner.only_owner();
        // Do stuff here
    }
    // ANCHOR_END: only_owner_example
}
```

Setting ownership can be done in one of two ways; During compile time or run time.

- The following is an example of how to properly set ownership of a contract during compile time:

```sway
contract;

// SRC-5 Ownership Standard `State` enum
pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

// SRC-5 Ownership Standard `Ownership` struct
pub struct Ownership {
    state: State,
}

// Skeleton implementation of the Ownership Library.
// The library can be found here https://github.com/FuelLabs/sway-libs/tree/master/libs/ownership
impl StorageKey<Ownership> {
    fn renounce_ownership(self) {}
    fn set_ownership(self, identity: Identity) {}
    fn owner(self) -> State {
        State::Uninitialized
    }
    fn only_owner(self) {}
}

impl Ownership {
    fn initialized(identity: Identity) -> Self {
        Self {
            state: State::Initialized(identity),
        }
    }
}

abi OwnershipExample {
    #[storage(write)]
    fn revoke_ownership();
    #[storage(write)]
    fn set_owner(identity: Identity);
    #[storage(read)]
    fn owner() -> State;
    #[storage(read)]
    fn only_owner();
}

// ANCHOR: set_owner_example_storage
storage {
    owner: Ownership = Ownership::initialized(Identity::Address(Address::zero())),
}
// ANCHOR_END: set_owner_example_storage

impl OwnershipExample for Contract {
    // ANCHOR: revoke_owner_example
    #[storage(write)]
    fn revoke_ownership() {
        storage.owner.renounce_ownership();
    }
    // ANCHOR_END: revoke_owner_example
    // ANCHOR: set_owner_example_function
    #[storage(write)]
    fn set_owner(identity: Identity) {
        storage.owner.set_ownership(identity);
    }
    // ANCHOR_END: set_owner_example_function
    // ANCHOR: get_owner_example
    #[storage(read)]
    fn owner() -> State {
        storage.owner.owner()
    }
    // ANCHOR_END: get_owner_example
    // ANCHOR: only_owner_example
    #[storage(read)]
    fn only_owner() {
        storage.owner.only_owner();
        // Do stuff here
    }
    // ANCHOR_END: only_owner_example
}
```

- The following is an example of how to properly set ownership of a contract during run time:

```sway
contract;

// SRC-5 Ownership Standard `State` enum
pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

// SRC-5 Ownership Standard `Ownership` struct
pub struct Ownership {
    state: State,
}

// Skeleton implementation of the Ownership Library.
// The library can be found here https://github.com/FuelLabs/sway-libs/tree/master/libs/ownership
impl StorageKey<Ownership> {
    fn renounce_ownership(self) {}
    fn set_ownership(self, identity: Identity) {}
    fn owner(self) -> State {
        State::Uninitialized
    }
    fn only_owner(self) {}
}

impl Ownership {
    fn initialized(identity: Identity) -> Self {
        Self {
            state: State::Initialized(identity),
        }
    }
}

abi OwnershipExample {
    #[storage(write)]
    fn revoke_ownership();
    #[storage(write)]
    fn set_owner(identity: Identity);
    #[storage(read)]
    fn owner() -> State;
    #[storage(read)]
    fn only_owner();
}

// ANCHOR: set_owner_example_storage
storage {
    owner: Ownership = Ownership::initialized(Identity::Address(Address::zero())),
}
// ANCHOR_END: set_owner_example_storage

impl OwnershipExample for Contract {
    // ANCHOR: revoke_owner_example
    #[storage(write)]
    fn revoke_ownership() {
        storage.owner.renounce_ownership();
    }
    // ANCHOR_END: revoke_owner_example
    // ANCHOR: set_owner_example_function
    #[storage(write)]
    fn set_owner(identity: Identity) {
        storage.owner.set_ownership(identity);
    }
    // ANCHOR_END: set_owner_example_function
    // ANCHOR: get_owner_example
    #[storage(read)]
    fn owner() -> State {
        storage.owner.owner()
    }
    // ANCHOR_END: get_owner_example
    // ANCHOR: only_owner_example
    #[storage(read)]
    fn only_owner() {
        storage.owner.only_owner();
        // Do stuff here
    }
    // ANCHOR_END: only_owner_example
}
```

- The following is an example of how to properly revoke ownership of a contract:

```sway
contract;

// SRC-5 Ownership Standard `State` enum
pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

// SRC-5 Ownership Standard `Ownership` struct
pub struct Ownership {
    state: State,
}

// Skeleton implementation of the Ownership Library.
// The library can be found here https://github.com/FuelLabs/sway-libs/tree/master/libs/ownership
impl StorageKey<Ownership> {
    fn renounce_ownership(self) {}
    fn set_ownership(self, identity: Identity) {}
    fn owner(self) -> State {
        State::Uninitialized
    }
    fn only_owner(self) {}
}

impl Ownership {
    fn initialized(identity: Identity) -> Self {
        Self {
            state: State::Initialized(identity),
        }
    }
}

abi OwnershipExample {
    #[storage(write)]
    fn revoke_ownership();
    #[storage(write)]
    fn set_owner(identity: Identity);
    #[storage(read)]
    fn owner() -> State;
    #[storage(read)]
    fn only_owner();
}

// ANCHOR: set_owner_example_storage
storage {
    owner: Ownership = Ownership::initialized(Identity::Address(Address::zero())),
}
// ANCHOR_END: set_owner_example_storage

impl OwnershipExample for Contract {
    // ANCHOR: revoke_owner_example
    #[storage(write)]
    fn revoke_ownership() {
        storage.owner.renounce_ownership();
    }
    // ANCHOR_END: revoke_owner_example
    // ANCHOR: set_owner_example_function
    #[storage(write)]
    fn set_owner(identity: Identity) {
        storage.owner.set_ownership(identity);
    }
    // ANCHOR_END: set_owner_example_function
    // ANCHOR: get_owner_example
    #[storage(read)]
    fn owner() -> State {
        storage.owner.owner()
    }
    // ANCHOR_END: get_owner_example
    // ANCHOR: only_owner_example
    #[storage(read)]
    fn only_owner() {
        storage.owner.only_owner();
        // Do stuff here
    }
    // ANCHOR_END: only_owner_example
}
```

- The following is an example of how to properly retrieve the state of ownership:

```sway
contract;

// SRC-5 Ownership Standard `State` enum
pub enum State {
    Uninitialized: (),
    Initialized: Identity,
    Revoked: (),
}

// SRC-5 Ownership Standard `Ownership` struct
pub struct Ownership {
    state: State,
}

// Skeleton implementation of the Ownership Library.
// The library can be found here https://github.com/FuelLabs/sway-libs/tree/master/libs/ownership
impl StorageKey<Ownership> {
    fn renounce_ownership(self) {}
    fn set_ownership(self, identity: Identity) {}
    fn owner(self) -> State {
        State::Uninitialized
    }
    fn only_owner(self) {}
}

impl Ownership {
    fn initialized(identity: Identity) -> Self {
        Self {
            state: State::Initialized(identity),
        }
    }
}

abi OwnershipExample {
    #[storage(write)]
    fn revoke_ownership();
    #[storage(write)]
    fn set_owner(identity: Identity);
    #[storage(read)]
    fn owner() -> State;
    #[storage(read)]
    fn only_owner();
}

// ANCHOR: set_owner_example_storage
storage {
    owner: Ownership = Ownership::initialized(Identity::Address(Address::zero())),
}
// ANCHOR_END: set_owner_example_storage

impl OwnershipExample for Contract {
    // ANCHOR: revoke_owner_example
    #[storage(write)]
    fn revoke_ownership() {
        storage.owner.renounce_ownership();
    }
    // ANCHOR_END: revoke_owner_example
    // ANCHOR: set_owner_example_function
    #[storage(write)]
    fn set_owner(identity: Identity) {
        storage.owner.set_ownership(identity);
    }
    // ANCHOR_END: set_owner_example_function
    // ANCHOR: get_owner_example
    #[storage(read)]
    fn owner() -> State {
        storage.owner.owner()
    }
    // ANCHOR_END: get_owner_example
    // ANCHOR: only_owner_example
    #[storage(read)]
    fn only_owner() {
        storage.owner.only_owner();
        // Do stuff here
    }
    // ANCHOR_END: only_owner_example
}
```

## Access Control Libraries

[Sway-Libs](../reference/sway_libs.md) provides the following libraries to enable further access control.

- [Ownership Library](https://fuellabs.github.io/sway-libs/book/ownership/index.html); used to apply restrictions on functions such that only a **single** user may call them. This library provides helper functions for the [SRC-5; Ownership Standard](https://github.com/FuelLabs/sway-standards/blob/master/docs/src/src-5-ownership.md).
- [Admin Library](https://fuellabs.github.io/sway-libs/book/admin/index.html); used to apply restrictions on functions such that only a select few users may call them like a whitelist.
- [Pausable Library](https://fuellabs.github.io/sway-libs/book/pausable/index.html); allows contracts to implement an emergency stop mechanism.
- [Reentrancy Guard Library](https://fuellabs.github.io/sway-libs/book/reentrancy/index.html); used to detect and prevent reentrancy attacks.

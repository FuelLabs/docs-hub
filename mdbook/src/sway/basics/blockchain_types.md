# Blockchain Types

Sway is fundamentally a blockchain language, and it offers a selection of types tailored for the blockchain use case.

These are provided via the standard library ([`lib-std`](https://github.com/FuelLabs/sway/tree/master/sway-lib-std)) which both add a degree of type-safety, as well as make the intention of the developer more clear.

## `Address` Type

<!-- This section should explain the `Address` type -->
<!-- address:example:start -->
The `Address` type is a type-safe wrapper around the primitive `b256` type. Unlike the EVM, an address **never** refers to a deployed smart contract (see the `ContractId` type below). An `Address` can be either the hash of a public key (effectively an [externally owned account](https://ethereum.org/en/whitepaper/#ethereum-accounts) if you're coming from the EVM) or the hash of a [predicate](../sway-program-types/predicates.md). Addresses own UTXOs.
<!-- address:example:end -->

An `Address` is implemented as follows.

```sway
pub struct Address {
    value: b256,
}
```

Casting between the `b256` and `Address` types must be done explicitly:

```sway
let my_number: b256 = 0x000000000000000000000000000000000000000000000000000000000000002A;
let my_address: Address = Address::from(my_number);
let forty_two: b256 = my_address.into();
```

## `ContractId` Type

<!-- This section should explain the `ContractId` type -->
<!-- contract_id:example:start -->
The `ContractId` type is a type-safe wrapper around the primitive `b256` type. A contract's ID is a unique, deterministic identifier analogous to a contract's address in the EVM. Contracts cannot own UTXOs but can own assets.
<!-- contract_id:example:end -->

A `ContractId` is implemented as follows.

```sway
pub struct ContractId {
    value: b256,
}
```

Casting between the `b256` and `ContractId` types must be done explicitly:

```sway
let my_number: b256 = 0x000000000000000000000000000000000000000000000000000000000000002A;
let my_contract_id: ContractId = ContractId::from(my_number);
let forty_two: b256 = my_contract_id.into();
```

### Getting a Contract's `ContractId`

To get the `ContractId` of a contract in an internal context use the `ContractId::this()` function:

```sway
impl MyContract for Contract {
    fn foo() {
        let this_contract_id: ContractId = ContractId::this();
    }
}
```

## `Identity` Type

<!-- This section should explain the `Identity` type -->
<!-- identity:example:start -->
The `Identity` type is an enum that allows for the handling of both `Address` and `ContractId` types. This is useful in cases where either type is accepted, e.g., receiving funds from an identified sender, but not caring if the sender is an address or a contract.
<!-- identity:example:end -->

An `Identity` is implemented as follows.

```sway
//! A wrapper type with two variants, `Address` and `ContractId`.
//! The use of this type allows for handling interactions with contracts and addresses in a unified manner.
library;

use ::codec::*;
use ::assert::assert;
use ::address::Address;
use ::alias::SubId;
use ::asset_id::AssetId;
use ::contract_id::ContractId;
use ::hash::{Hash, Hasher};
use ::option::Option::{self, *};
use ::ops::*;

/// The `Identity` type: either an `Address` or a `ContractId`.
// ANCHOR: docs_identity
pub enum Identity {
    Address: Address,
    ContractId: ContractId,
}
// ANCHOR_END: docs_identity

impl PartialEq for Identity {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (Identity::Address(addr1), Identity::Address(addr2)) => addr1 == addr2,
            (Identity::ContractId(id1), Identity::ContractId(id2)) => id1 == id2,
            _ => false,
        }
    }
}
impl Eq for Identity {}

impl Identity {
    /// Returns the `Address` of the `Identity`.
    ///
    /// # Returns
    ///
    /// * [Option<Address>] - `Some(Address)` if the underlying type is an `Address`, otherwise `None`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let identity = Identity::Address(Address::zero());
    ///     let address = identity.as_address();
    ///     assert(address == Address::zero());
    /// }
    /// ```
    pub fn as_address(self) -> Option<Address> {
        match self {
            Self::Address(addr) => Some(addr),
            Self::ContractId(_) => None,
        }
    }

    /// Returns the `ContractId` of the `Identity`.
    ///
    /// # Returns
    ///
    /// * [Option<ContractId>] - `Some(Contract)` if the underlying type is an `ContractId`, otherwise `None`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let identity = Identity::ContractId(ContractId::zero());
    ///     let contract_id = identity.as_contract_id();
    ///     assert(contract_id == ContractId::zero());
    /// }
    /// ```
    pub fn as_contract_id(self) -> Option<ContractId> {
        match self {
            Self::Address(_) => None,
            Self::ContractId(id) => Some(id),
        }
    }

    /// Returns whether the `Identity` represents an `Address`.
    ///
    /// # Returns
    ///
    /// * [bool] - Indicates whether the `Identity` holds an `Address`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let identity = Identity::Address(Address::zero());
    ///     assert(identity.is_address());
    /// }
    /// ```
    pub fn is_address(self) -> bool {
        match self {
            Self::Address(_) => true,
            Self::ContractId(_) => false,
        }
    }

    /// Returns whether the `Identity` represents a `ContractId`.
    ///
    /// # Returns
    ///
    /// * [bool] - Indicates whether the `Identity` holds a `ContractId`.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() {
    ///     let identity = Identity::ContractId(ContractId::zero());
    ///     assert(identity.is_contract_id());
    /// }
    /// ```
    pub fn is_contract_id(self) -> bool {
        match self {
            Self::Address(_) => false,
            Self::ContractId(_) => true,
        }
    }

    /// Returns the underlying raw `b256` data of the identity.
    ///
    /// # Returns
    ///
    /// * [b256] - The raw data of the identity.
    ///
    /// # Examples
    ///
    /// ```sway
    /// fn foo() -> {
    ///     let my_identity = Identity::Address(Address::zero());
    ///     assert(my_identity.bits() == b256::zero());
    /// }
    /// ```
    pub fn bits(self) -> b256 {
        match self {
            Self::Address(address) => address.bits(),
            Self::ContractId(contract_id) => contract_id.bits(),
        }
    }
}

impl Hash for Identity {
    fn hash(self, ref mut state: Hasher) {
        match self {
            Identity::Address(address) => {
                0_u8.hash(state);
                address.hash(state);
            },
            Identity::ContractId(id) => {
                1_u8.hash(state);
                id.hash(state);
            },
        }
    }
}
```

Casting to an `Identity` must be done explicitly:

```sway
contract;

mod r#abi;
mod errors;

use abi::IdentityExample;
use errors::MyError;

use std::asset::transfer;

storage {
    owner: Identity = Identity::ContractId(ContractId::zero()),
}

impl IdentityExample for Contract {
    fn cast_to_identity() {
        // ANCHOR: cast_to_identity
        let raw_address: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let my_identity: Identity = Identity::Address(Address::from(raw_address));
        // ANCHOR_END: cast_to_identity
    }

    fn identity_to_contract_id(my_identity: Identity) {
        // ANCHOR: identity_to_contract_id
        let my_contract_id: ContractId = match my_identity {
            Identity::ContractId(identity) => identity,
            _ => revert(0),
        };
        // ANCHOR_END: identity_to_contract_id
    }

    fn different_executions(my_identity: Identity) {
        // ANCHOR: different_executions
        match my_identity {
            Identity::Address(address) => takes_address(address),
            Identity::ContractId(contract_id) => takes_contract_id(contract_id),
        };
        // ANCHOR_END: different_executions
    }

    #[storage(read)]
    fn access_control_with_identity() {
        // ANCHOR: access_control_with_identity
        let sender = msg_sender().unwrap();
        require(
            sender == storage
                .owner
                .read(),
            MyError::UnauthorizedUser(sender),
        );
        // ANCHOR_END: access_control_with_identity
    }
}

fn takes_address(address: Address) {}

fn takes_contract_id(contract_id: ContractId) {}
```

A `match` statement can be used to return to an `Address` or `ContractId` as well as handle cases in which their execution differs.

```sway
contract;

mod r#abi;
mod errors;

use abi::IdentityExample;
use errors::MyError;

use std::asset::transfer;

storage {
    owner: Identity = Identity::ContractId(ContractId::zero()),
}

impl IdentityExample for Contract {
    fn cast_to_identity() {
        // ANCHOR: cast_to_identity
        let raw_address: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let my_identity: Identity = Identity::Address(Address::from(raw_address));
        // ANCHOR_END: cast_to_identity
    }

    fn identity_to_contract_id(my_identity: Identity) {
        // ANCHOR: identity_to_contract_id
        let my_contract_id: ContractId = match my_identity {
            Identity::ContractId(identity) => identity,
            _ => revert(0),
        };
        // ANCHOR_END: identity_to_contract_id
    }

    fn different_executions(my_identity: Identity) {
        // ANCHOR: different_executions
        match my_identity {
            Identity::Address(address) => takes_address(address),
            Identity::ContractId(contract_id) => takes_contract_id(contract_id),
        };
        // ANCHOR_END: different_executions
    }

    #[storage(read)]
    fn access_control_with_identity() {
        // ANCHOR: access_control_with_identity
        let sender = msg_sender().unwrap();
        require(
            sender == storage
                .owner
                .read(),
            MyError::UnauthorizedUser(sender),
        );
        // ANCHOR_END: access_control_with_identity
    }
}

fn takes_address(address: Address) {}

fn takes_contract_id(contract_id: ContractId) {}
```

```sway
contract;

mod r#abi;
mod errors;

use abi::IdentityExample;
use errors::MyError;

use std::asset::transfer;

storage {
    owner: Identity = Identity::ContractId(ContractId::zero()),
}

impl IdentityExample for Contract {
    fn cast_to_identity() {
        // ANCHOR: cast_to_identity
        let raw_address: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let my_identity: Identity = Identity::Address(Address::from(raw_address));
        // ANCHOR_END: cast_to_identity
    }

    fn identity_to_contract_id(my_identity: Identity) {
        // ANCHOR: identity_to_contract_id
        let my_contract_id: ContractId = match my_identity {
            Identity::ContractId(identity) => identity,
            _ => revert(0),
        };
        // ANCHOR_END: identity_to_contract_id
    }

    fn different_executions(my_identity: Identity) {
        // ANCHOR: different_executions
        match my_identity {
            Identity::Address(address) => takes_address(address),
            Identity::ContractId(contract_id) => takes_contract_id(contract_id),
        };
        // ANCHOR_END: different_executions
    }

    #[storage(read)]
    fn access_control_with_identity() {
        // ANCHOR: access_control_with_identity
        let sender = msg_sender().unwrap();
        require(
            sender == storage
                .owner
                .read(),
            MyError::UnauthorizedUser(sender),
        );
        // ANCHOR_END: access_control_with_identity
    }
}

fn takes_address(address: Address) {}

fn takes_contract_id(contract_id: ContractId) {}
```
<!-- This section should explain the use case for the `Identity` type -->
<!-- use_identity:example:start -->
A common use case for `Identity` is for access control. The use of `Identity` uniquely allows both `ContractId` and `Address` to have access control inclusively.
<!-- use_identity:example:end -->

```sway
contract;

mod r#abi;
mod errors;

use abi::IdentityExample;
use errors::MyError;

use std::asset::transfer;

storage {
    owner: Identity = Identity::ContractId(ContractId::zero()),
}

impl IdentityExample for Contract {
    fn cast_to_identity() {
        // ANCHOR: cast_to_identity
        let raw_address: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let my_identity: Identity = Identity::Address(Address::from(raw_address));
        // ANCHOR_END: cast_to_identity
    }

    fn identity_to_contract_id(my_identity: Identity) {
        // ANCHOR: identity_to_contract_id
        let my_contract_id: ContractId = match my_identity {
            Identity::ContractId(identity) => identity,
            _ => revert(0),
        };
        // ANCHOR_END: identity_to_contract_id
    }

    fn different_executions(my_identity: Identity) {
        // ANCHOR: different_executions
        match my_identity {
            Identity::Address(address) => takes_address(address),
            Identity::ContractId(contract_id) => takes_contract_id(contract_id),
        };
        // ANCHOR_END: different_executions
    }

    #[storage(read)]
    fn access_control_with_identity() {
        // ANCHOR: access_control_with_identity
        let sender = msg_sender().unwrap();
        require(
            sender == storage
                .owner
                .read(),
            MyError::UnauthorizedUser(sender),
        );
        // ANCHOR_END: access_control_with_identity
    }
}

fn takes_address(address: Address) {}

fn takes_contract_id(contract_id: ContractId) {}
```

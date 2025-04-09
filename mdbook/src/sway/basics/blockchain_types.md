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
pub enum Identity {
    Address: Address,
    ContractId: ContractId,
}
```

Casting to an `Identity` must be done explicitly:

```sway
let raw_address: b256 = 0xddec0e7e6a9a4a4e3e57d08d080d71a299c628a46bc609aab4627695679421ca;
        let my_identity: Identity = Identity::Address(Address::from(raw_address));
```

A `match` statement can be used to return to an `Address` or `ContractId` as well as handle cases in which their execution differs.

```sway
let my_contract_id: ContractId = match my_identity {
            Identity::ContractId(identity) => identity,
            _ => revert(0),
        };
```

```sway
match my_identity {
            Identity::Address(address) => takes_address(address),
            Identity::ContractId(contract_id) => takes_contract_id(contract_id),
        };
```
<!-- This section should explain the use case for the `Identity` type -->
<!-- use_identity:example:start -->
A common use case for `Identity` is for access control. The use of `Identity` uniquely allows both `ContractId` and `Address` to have access control inclusively.
<!-- use_identity:example:end -->

```sway
let sender = msg_sender().unwrap();
        require(
            sender == storage
                .owner
                .read(),
            MyError::UnauthorizedUser(sender),
        );
```

# `ContractId`

Like `Bytes32`, `ContractId` is a wrapper on `[u8; 32]` with similar methods and implements the same traits (see [fuel-types documentation](https://docs.rs/fuel-types/0.49.0/fuel_types/struct.ContractId.html)).

These are the main ways of creating a `ContractId`:

```rust,ignore
use std::str::FromStr;

        use fuels::types::ContractId;

        // Zeroed Bytes32
        let contract_id = ContractId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *contract_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_contract_id
        let my_slice = [1u8; 32];
        let contract_id = ContractId::new(my_slice);
        // ANCHOR_END: array_to_contract_id
        assert_eq!([1u8; 32], *contract_id);

        // From a string.
        // ANCHOR: string_to_contract_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let contract_id = ContractId::from_str(hex_str)?;
        // ANCHOR_END: string_to_contract_id
        assert_eq!([0u8; 32], *contract_id);
```

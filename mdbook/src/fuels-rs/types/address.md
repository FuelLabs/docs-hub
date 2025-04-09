# `Address`

Like `Bytes32`, `Address` is a wrapper on `[u8; 32]` with similar methods and implements the same traits (see [fuel-types documentation](https://docs.rs/fuel-types/latest/fuel_types/struct.Address.html)).

These are the main ways of creating an `Address`:

```rust,ignore
use std::str::FromStr;

        use fuels::types::Address;

        // Zeroed Bytes32
        let address = Address::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *address);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_address
        let my_slice = [1u8; 32];
        let address = Address::new(my_slice);
        // ANCHOR_END: array_to_address
        assert_eq!([1u8; 32], *address);

        // From a string.
        // ANCHOR: hex_string_to_address
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let address = Address::from_str(hex_str)?;
        // ANCHOR_END: hex_string_to_address
        assert_eq!([0u8; 32], *address);
```

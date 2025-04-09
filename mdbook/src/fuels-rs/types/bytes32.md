# `Bytes32`

In Sway and the FuelVM, `Bytes32` represents hashes. They hold a 256-bit (32-byte) value. `Bytes32` is a wrapper on a 32-sized slice of `u8`: `pub struct Bytes32([u8; 32]);`.

These are the main ways of creating a `Bytes32`:

```rust,ignore
use std::str::FromStr;

        use fuels::types::Bytes32;

        // Zeroed Bytes32
        let b256 = Bytes32::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *b256);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_bytes32
        let my_slice = [1u8; 32];
        let b256 = Bytes32::new(my_slice);
        // ANCHOR_END: array_to_bytes32
        assert_eq!([1u8; 32], *b256);

        // From a hex string.
        // ANCHOR: hex_string_to_bytes32
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let b256 = Bytes32::from_str(hex_str)?;
        // ANCHOR_END: hex_string_to_bytes32
        assert_eq!([0u8; 32], *b256);
```

`Bytes32` also implements the `fmt` module's `Debug`, `Display`, `LowerHex` and `UpperHex` traits. For example, you can get the display and hex representations with:

```rust,ignore
let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
```

For a full list of implemented methods and traits, see the [fuel-types documentation](https://docs.rs/fuel-types/latest/fuel_types/struct.Bytes32.html).

> **Note:** In Fuel, there's a special type called `b256`, which is similar to `Bytes32`; also used to represent hashes, and it holds a 256-bit value. In Rust, through the SDK, this is represented as `Bits256(value)` where `value` is a `[u8; 32]`. If your contract method takes a `b256` as input, all you need to do is pass a `Bits256([u8; 32])` when calling it from the SDK.

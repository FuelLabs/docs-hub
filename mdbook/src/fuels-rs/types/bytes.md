# `Bytes`

In Fuel, a type called `Bytes` represents a collection of tightly-packed bytes. The Rust SDK represents `Bytes` as `Bytes(Vec<u8>)`. Here's an example of using `Bytes` in a contract call:

```rust,ignore
let bytes = Bytes(vec![40, 41, 42]);

        contract_methods.accept_bytes(bytes).call().await?;
```

If you have a hexadecimal value as a string and wish to convert it to `Bytes`, you may do so with `from_hex_str`:

```rust,ignore
let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";

        let bytes = Bytes::from_hex_str(hex_str)?;

        assert_eq!(bytes.0, vec![1u8; 32]);

        // With the `0x0` prefix
        // ANCHOR: hex_string_to_bytes32
        let hex_str = "0x0101010101010101010101010101010101010101010101010101010101010101";

        let bytes = Bytes::from_hex_str(hex_str)?;
        // ANCHOR_END: hex_string_to_bytes32

        assert_eq!(bytes.0, vec![1u8; 32]);
```

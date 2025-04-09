# `Bech32`

`Bech32Address` and `Bech32ContractId` enable the use of addresses and contract IDs in the `bech32` format. They can easily be converted to their counterparts `Address` and `ContractId`.

Here are the main ways of creating a `Bech32Address`, but note that the same applies to `Bech32ContractId`:

```rust,ignore
use fuels::types::{bech32::Bech32Address, Address, Bytes32};

        // New from HRP string and a hash
        // ANCHOR: array_to_bech32
        let hrp = "fuel";
        let my_slice = [1u8; 32];
        let _bech32_address = Bech32Address::new(hrp, my_slice);
        // ANCHOR_END: array_to_bech32

        // Note that you can also pass a hash stored as Bytes32 to new:
        // ANCHOR: bytes32_to_bech32
        let my_hash = Bytes32::new([1u8; 32]);
        let _bech32_address = Bech32Address::new(hrp, my_hash);
        // ANCHOR_END: bytes32_to_bech32

        // From a string.
        // ANCHOR: str_to_bech32
        let address = "fuel1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsx2mt2";
        let bech32_address = Bech32Address::from_str(address)?;
        // ANCHOR_END: str_to_bech32
        assert_eq!([0u8; 32], *bech32_address.hash());

        // From Address
        // ANCHOR: address_to_bech32
        let plain_address = Address::new([0u8; 32]);
        let bech32_address = Bech32Address::from(plain_address);
        // ANCHOR_END: address_to_bech32
        assert_eq!([0u8; 32], *bech32_address.hash());

        // Convert to Address
        // ANCHOR: bech32_to_address
        let _plain_address: Address = bech32_address.into();
        // ANCHOR_END: bech32_to_address
```

> **Note:** when creating a `Bech32Address` from `Address` or `Bech32ContractId` from `ContractId` the `HRP` (Human-Readable Part) is set to **"fuel"** per default.

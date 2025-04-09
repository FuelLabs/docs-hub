# Converting Types

Below you can find examples for common type conversions:

- [Convert Between Native Types](#convert-between-native-types)
- [Convert to `Bytes32`](#convert-to-bytes32)
- [Convert to `Address`](#convert-to-address)
- [Convert to `ContractId`](#convert-to-contractid)
- [Convert to `Identity`](#convert-to-identity)
- [Convert to `AssetId`](#convert-to-assetid)
- [Convert to `Bech32`](#convert-to-bech32)
- [Convert to `str`](#convert-to-str)
- [Convert to `Bits256`](#convert-to-bits256)
- [Convert to `Bytes`](#convert-to-bytes)
- [Convert to `B512`](#convert-to-b512)
- [Convert to `EvmAddress`](#convert-to-evmaddress)

## Convert Between Native Types

You might want to convert between the native types (`Bytes32`, `Address`, `ContractId`, and `AssetId`). Because these types are wrappers on `[u8; 32]`, converting is a matter of dereferencing one and instantiating the other using the dereferenced value. Here's an example:

```rust,ignore
use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
```

## Convert to `Bytes32`

Convert a `[u8; 32]` array to `Bytes32`:

```rust,ignore
let my_slice = [1u8; 32];
        let b256 = Bytes32::new(my_slice);
```

Convert a hex string to `Bytes32`:

```rust,ignore
let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let b256 = Bytes32::from_str(hex_str)?;
```

## Convert to `Address`

Convert a `[u8; 32]` array to an `Address`:

```rust,ignore
let my_slice = [1u8; 32];
        let address = Address::new(my_slice);
```

Convert a `Bech32` address to an `Address`:

```rust,ignore
let _plain_address: Address = bech32_address.into();
```

Convert a wallet to an `Address`:

```rust,ignore
let wallet_unlocked = WalletUnlocked::new_random(None);
        let address: Address = wallet_unlocked.address().into();
```

Convert a hex string to an `Address`:

```rust,ignore
let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let address = Address::from_str(hex_str)?;
```

## Convert to `ContractId`

Convert a `[u8; 32]` array to `ContractId`:

```rust,ignore
let my_slice = [1u8; 32];
        let contract_id = ContractId::new(my_slice);
```

Convert a hex string to a `ContractId`:

```rust,ignore
let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let contract_id = ContractId::from_str(hex_str)?;
```

Convert a contract instance to a `ContractId`:

```rust,ignore
let contract_id: ContractId = contract_instance.id().into();
```

## Convert to `Identity`

Convert an `Address` to an `Identity`:

```rust,ignore
let _identity_from_address = Identity::Address(address);
```

Convert a `ContractId` to an `Identity`:

```rust,ignore
let _identity_from_contract_id = Identity::ContractId(contract_id);
```

## Convert to `AssetId`

Convert a `[u8; 32]` array to an `AssetId`:

```rust,ignore
let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
```

Convert a hex string to an `AssetId`:

```rust,ignore
let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
```

## Convert to `Bech32`

Convert a `[u8; 32]` array to a `Bech32` address:

```rust,ignore
let hrp = "fuel";
        let my_slice = [1u8; 32];
        let _bech32_address = Bech32Address::new(hrp, my_slice);
```

Convert `Bytes32` to a `Bech32` address:

```rust,ignore
let my_hash = Bytes32::new([1u8; 32]);
        let _bech32_address = Bech32Address::new(hrp, my_hash);
```

Convert a string to a `Bech32` address:

```rust,ignore
let address = "fuel1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsx2mt2";
        let bech32_address = Bech32Address::from_str(address)?;
```

Convert an `Address` to a `Bech32` address:

```rust,ignore
let plain_address = Address::new([0u8; 32]);
        let bech32_address = Bech32Address::from(plain_address);
```

## Convert to `str`

Convert a `ContractId` to a `str`:

```rust,ignore
let _str_from_contract_id: &str = contract_id.to_string().as_str();
```

Convert an `Address` to a `str`:

```rust,ignore
let _str_from_address: &str = address.to_string().as_str();
```

Convert an `AssetId` to a `str`:

```rust,ignore
let _str_from_asset_id: &str = asset_id.to_string().as_str();
```

Convert `Bytes32` to a `str`:

```rust,ignore
let _str_from_bytes32: &str = b256.to_string().as_str();
```

## Convert to `Bits256`

Convert a hex string to `Bits256`:

```rust,ignore
let hex_str = "0x0101010101010101010101010101010101010101010101010101010101010101";

        let bits256 = Bits256::from_hex_str(hex_str)?;
```

Convert a `ContractId` to `Bits256`:

```rust,ignore
let _contract_id_to_bits_256 = Bits256(contract_id.into());
```

Convert an `Address` to `Bits256`:

```rust,ignore
let bits_256 = Bits256(address.into());
```

Convert an `AssetId` to `Bits256`:

```rust,ignore
let _asset_id_to_bits_256 = Bits256(asset_id.into());
```

## Convert to `Bytes`

Convert a string to `Bytes`:

```rust,ignore
let hex_str = "0x0101010101010101010101010101010101010101010101010101010101010101";

        let bytes = Bytes::from_hex_str(hex_str)?;
```

## Convert to `B512`

Convert two hex strings to `B512`:

```rust,ignore
let hi_bits = Bits256::from_hex_str(
        "0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c",
    )?;
    let lo_bits = Bits256::from_hex_str(
        "0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d",
    )?;
    let b512 = B512::from((hi_bits, lo_bits));
```

## Convert to `EvmAddress`

Convert a `Bits256` address to an `EvmAddress`:

```rust,ignore
let _evm_address = EvmAddress::from(bits_256);
```

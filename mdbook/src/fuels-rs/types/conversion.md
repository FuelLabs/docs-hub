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
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `Bytes32`

Convert a `[u8; 32]` array to `Bytes32`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a hex string to `Bytes32`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `Address`

Convert a `[u8; 32]` array to an `Address`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a `Bech32` address to an `Address`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a wallet to an `Address`:

```rust,ignore
#[cfg(test)]
mod tests {
    use fuels::prelude::*;

    #[tokio::test]
    async fn create_random_wallet() -> Result<()> {
        // ANCHOR: create_random_wallet
        use fuels::prelude::*;

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Create the wallet.
        let _wallet = WalletUnlocked::new_random(Some(provider));
        // ANCHOR_END: create_random_wallet

        Ok(())
    }

    #[tokio::test]
    async fn create_wallet_from_secret_key() -> std::result::Result<(), Box<dyn std::error::Error>>
    {
        // ANCHOR: create_wallet_from_secret_key
        use std::str::FromStr;

        use fuels::{crypto::SecretKey, prelude::*};

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Setup the private key.
        let secret = SecretKey::from_str(
            "5f70feeff1f229e4a95e1056e8b4d80d0b24b565674860cc213bdb07127ce1b1",
        )?;

        // Create the wallet.
        let _wallet = WalletUnlocked::new_from_private_key(secret, Some(provider));
        // ANCHOR_END: create_wallet_from_secret_key
        Ok(())
    }

    #[tokio::test]
    async fn create_wallet_from_mnemonic() -> Result<()> {
        // ANCHOR: create_wallet_from_mnemonic
        use fuels::prelude::*;

        let phrase =
            "oblige salon price punch saddle immune slogan rare snap desert retire surprise";

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Create first account from mnemonic phrase.
        let _wallet = WalletUnlocked::new_from_mnemonic_phrase_with_path(
            phrase,
            Some(provider.clone()),
            "m/44'/1179993420'/0'/0/0",
        )?;

        // Or with the default derivation path
        let wallet = WalletUnlocked::new_from_mnemonic_phrase(phrase, Some(provider))?;

        let expected_address = "fuel17x9kg3k7hqf42396vqenukm4yf59e5k0vj4yunr4mae9zjv9pdjszy098t";

        assert_eq!(wallet.address().to_string(), expected_address);
        // ANCHOR_END: create_wallet_from_mnemonic
        Ok(())
    }

    #[tokio::test]
    async fn create_and_restore_json_wallet() -> Result<()> {
        // ANCHOR: create_and_restore_json_wallet
        use fuels::prelude::*;

        let dir = std::env::temp_dir();
        let mut rng = rand::thread_rng();

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        let password = "my_master_password";

        // Create a wallet to be stored in the keystore.
        let (_wallet, uuid) =
            WalletUnlocked::new_from_keystore(&dir, &mut rng, password, Some(provider.clone()))?;

        let path = dir.join(uuid);

        let _recovered_wallet = WalletUnlocked::load_keystore(path, password, Some(provider))?;
        // ANCHOR_END: create_and_restore_json_wallet
        Ok(())
    }

    #[tokio::test]
    async fn create_and_store_mnemonic_wallet() -> Result<()> {
        // ANCHOR: create_and_store_mnemonic_wallet
        use fuels::prelude::*;

        let dir = std::env::temp_dir();

        let phrase =
            "oblige salon price punch saddle immune slogan rare snap desert retire surprise";

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Create first account from mnemonic phrase.
        let wallet = WalletUnlocked::new_from_mnemonic_phrase(phrase, Some(provider))?;

        let password = "my_master_password";

        // Encrypts and stores it on disk. Can be recovered using `Wallet::load_keystore`.
        let _uuid = wallet.encrypt(&dir, password)?;
        // ANCHOR_END: create_and_store_mnemonic_wallet
        Ok(())
    }

    #[tokio::test]
    async fn wallet_transfer() -> Result<()> {
        // ANCHOR: wallet_transfer
        use fuels::prelude::*;

        // Setup 2 test wallets with 1 coin each
        let num_wallets = 2;
        let coins_per_wallet = 1;
        let coin_amount = 2;

        let wallets = launch_custom_provider_and_get_wallets(
            WalletsConfig::new(Some(num_wallets), Some(coins_per_wallet), Some(coin_amount)),
            None,
            None,
        )
        .await?;

        // Transfer the base asset with amount 1 from wallet 1 to wallet 2
        let transfer_amount = 1;
        let asset_id = Default::default();
        let (_tx_id, _receipts) = wallets[0]
            .transfer(
                wallets[1].address(),
                transfer_amount,
                asset_id,
                TxPolicies::default(),
            )
            .await?;

        let wallet_2_final_coins = wallets[1].get_coins(AssetId::zeroed()).await?;

        // Check that wallet 2 now has 2 coins
        assert_eq!(wallet_2_final_coins.len(), 2);

        // ANCHOR_END: wallet_transfer
        Ok(())
    }

    #[tokio::test]
    async fn wallet_contract_transfer() -> Result<()> {
        use fuels::prelude::*;
        use rand::Fill;

        let mut rng = rand::thread_rng();

        let base_asset = AssetConfig {
            id: AssetId::zeroed(),
            num_coins: 1,
            coin_amount: 1000,
        };

        let mut random_asset_id = AssetId::zeroed();
        random_asset_id.try_fill(&mut rng).unwrap();
        let random_asset = AssetConfig {
            id: random_asset_id,
            num_coins: 3,
            coin_amount: 100,
        };

        let wallet_config = WalletsConfig::new_multiple_assets(1, vec![random_asset, base_asset]);
        let wallet = launch_custom_provider_and_get_wallets(wallet_config, None, None)
            .await?
            .pop()
            .unwrap();

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: wallet_contract_transfer
        // Check the current balance of the contract with id 'contract_id'
        let contract_balances = wallet
            .try_provider()?
            .get_contract_balances(&contract_id)
            .await?;
        assert!(contract_balances.is_empty());

        // Transfer an amount of 300 to the contract
        let amount = 300;
        let asset_id = random_asset_id;
        let (_tx_id, _receipts) = wallet
            .force_transfer_to_contract(&contract_id, amount, asset_id, TxPolicies::default())
            .await?;

        // Check that the contract now has 1 coin
        let contract_balances = wallet
            .try_provider()?
            .get_contract_balances(&contract_id)
            .await?;
        assert_eq!(contract_balances.len(), 1);

        let random_asset_balance = contract_balances.get(&random_asset_id).unwrap();
        assert_eq!(*random_asset_balance, 300);
        // ANCHOR_END: wallet_contract_transfer

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn setup_multiple_wallets() -> Result<()> {
        // ANCHOR: multiple_wallets_helper
        use fuels::prelude::*;
        // This helper will launch a local node and provide 10 test wallets linked to it.
        // The initial balance defaults to 1 coin per wallet with an amount of 1_000_000_000
        let wallets =
            launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;
        // ANCHOR_END: multiple_wallets_helper
        // ANCHOR: setup_5_wallets
        let num_wallets = 5;
        let coins_per_wallet = 3;
        let amount_per_coin = 100;

        let config = WalletsConfig::new(
            Some(num_wallets),
            Some(coins_per_wallet),
            Some(amount_per_coin),
        );
        // Launches a local node and provides test wallets as specified by the config
        let wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
        // ANCHOR_END: setup_5_wallets
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn setup_wallet_multiple_assets() -> Result<()> {
        // ANCHOR: multiple_assets_wallet
        // ANCHOR: multiple_assets_coins
        use fuels::prelude::*;
        let mut wallet = WalletUnlocked::new_random(None);
        let num_assets = 5; // 5 different assets
        let coins_per_asset = 10; // Per asset id, 10 coins in the wallet
        let amount_per_coin = 15; // For each coin (UTXO) of the asset, amount of 15

        let (coins, asset_ids) = setup_multiple_assets_coins(
            wallet.address(),
            num_assets,
            coins_per_asset,
            amount_per_coin,
        );
        // ANCHOR_END: multiple_assets_coins
        let provider = setup_test_provider(coins.clone(), vec![], None, None).await?;
        wallet.set_provider(provider);
        // ANCHOR_END: multiple_assets_wallet
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn setup_wallet_custom_assets() -> std::result::Result<(), Box<dyn std::error::Error>> {
        // ANCHOR: custom_assets_wallet
        use fuels::prelude::*;
        use rand::Fill;

        let mut wallet = WalletUnlocked::new_random(None);
        let mut rng = rand::thread_rng();

        let asset_base = AssetConfig {
            id: AssetId::zeroed(),
            num_coins: 2,
            coin_amount: 4,
        };

        let mut asset_id_1 = AssetId::zeroed();
        asset_id_1.try_fill(&mut rng)?;
        let asset_1 = AssetConfig {
            id: asset_id_1,
            num_coins: 6,
            coin_amount: 8,
        };

        let mut asset_id_2 = AssetId::zeroed();
        asset_id_2.try_fill(&mut rng)?;
        let asset_2 = AssetConfig {
            id: asset_id_2,
            num_coins: 10,
            coin_amount: 12,
        };

        let assets = vec![asset_base, asset_1, asset_2];

        let coins = setup_custom_assets_coins(wallet.address(), &assets);
        let provider = setup_test_provider(coins, vec![], None, None).await?;
        wallet.set_provider(provider);
        // ANCHOR_END: custom_assets_wallet
        // ANCHOR: custom_assets_wallet_short
        let num_wallets = 1;
        let wallet_config = WalletsConfig::new_multiple_assets(num_wallets, assets);
        let wallets = launch_custom_provider_and_get_wallets(wallet_config, None, None).await?;
        // ANCHOR_END: custom_assets_wallet_short

        // ANCHOR: wallet_to_address
        let wallet_unlocked = WalletUnlocked::new_random(None);
        let address: Address = wallet_unlocked.address().into();
        // ANCHOR_END: wallet_to_address
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn get_balances() -> Result<()> {
        use std::collections::HashMap;

        use fuels::{
            prelude::{launch_provider_and_get_wallet, DEFAULT_COIN_AMOUNT, DEFAULT_NUM_COINS},
            types::AssetId,
        };

        let wallet = launch_provider_and_get_wallet().await?;
        // ANCHOR: get_asset_balance
        let asset_id = AssetId::zeroed();
        let balance: u64 = wallet.get_asset_balance(&asset_id).await?;
        // ANCHOR_END: get_asset_balance
        // ANCHOR: get_balances
        let balances: HashMap<String, u128> = wallet.get_balances().await?;
        // ANCHOR_END: get_balances

        // ANCHOR: get_balance_hashmap
        let asset_balance = balances.get(&asset_id.to_string()).unwrap();
        // ANCHOR_END: get_balance_hashmap

        assert_eq!(
            *asset_balance,
            (DEFAULT_COIN_AMOUNT * DEFAULT_NUM_COINS) as u128
        );

        Ok(())
    }

    #[tokio::test]
    async fn wallet_transfer_to_base_layer() -> Result<()> {
        // ANCHOR: wallet_withdraw_to_base
        use std::str::FromStr;

        use fuels::prelude::*;

        let wallets = launch_custom_provider_and_get_wallets(
            WalletsConfig::new(Some(1), None, None),
            None,
            None,
        )
        .await?;
        let wallet = wallets.first().unwrap();

        let amount = 1000;
        let base_layer_address = Address::from_str(
            "0x4710162c2e3a95a6faff05139150017c9e38e5e280432d546fae345d6ce6d8fe",
        )?;
        let base_layer_address = Bech32Address::from(base_layer_address);
        // Transfer an amount of 1000 to the specified base layer address
        let (tx_id, msg_id, _receipts) = wallet
            .withdraw_to_base_layer(&base_layer_address, amount, TxPolicies::default())
            .await?;

        let _block_height = wallet.try_provider()?.produce_blocks(1, None).await?;

        // Retrieve a message proof from the provider
        let proof = wallet
            .try_provider()?
            .get_message_proof(&tx_id, &msg_id, None, Some(2))
            .await?;

        // Verify the amount and recipient
        assert_eq!(proof.amount, amount);
        assert_eq!(proof.recipient, base_layer_address);
        // ANCHOR_END: wallet_withdraw_to_base

        Ok(())
    }
}
```

Convert a hex string to an `Address`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `ContractId`

Convert a `[u8; 32]` array to `ContractId`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a hex string to a `ContractId`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a contract instance to a `ContractId`:

```rust,ignore
use fuels::{
    core::codec::DecoderConfig,
    prelude::*,
    types::{errors::transaction::Reason, AsciiString, Bits256, SizedAsciiString},
};

#[tokio::test]
async fn test_parse_logged_variables() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: produce_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_variables().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_bits256 = response.decode_logs_with_type::<Bits256>()?;
    let log_string = response.decode_logs_with_type::<SizedAsciiString<4>>()?;
    let log_array = response.decode_logs_with_type::<[u8; 3]>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_bits256, vec![expected_bits256]);
    assert_eq!(log_string, vec!["Fuel"]);
    assert_eq!(log_array, vec![[1, 2, 3]]);
    // ANCHOR_END: produce_logs

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_values() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_values().call().await?;

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_custom_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_custom_types().call().await?;

    let log_test_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_test_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_tuple = response.decode_logs_with_type::<(TestStruct, TestEnum)>()?;

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;

    assert_eq!(log_test_struct, vec![expected_struct.clone()]);
    assert_eq!(log_test_enum, vec![expected_enum.clone()]);
    assert_eq!(log_tuple, vec![(expected_struct, expected_enum)]);

    Ok(())
}

#[tokio::test]
async fn test_parse_logs_generic_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_logs_generic_types().call().await?;

    let log_struct = response.decode_logs_with_type::<StructWithGeneric<[_; 3]>>()?;
    let log_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_struct_nested =
        response.decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<[_; 3]>>>()?;
    let log_struct_deeply_nested = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<[_; 3]>>,
    >>()?;

    let l = [1u8, 2u8, 3u8];
    let expected_struct = StructWithGeneric {
        field_1: l,
        field_2: 64,
    };
    let expected_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_struct_nested, vec![expected_nested_struct]);
    assert_eq!(
        log_struct_deeply_nested,
        vec![expected_deeply_nested_struct]
    );

    Ok(())
}

#[tokio::test]
async fn test_decode_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // ANCHOR: decode_logs
    let contract_methods = contract_instance.methods();
    let response = contract_methods.produce_multiple_logs().call().await?;
    let logs = response.decode_logs();
    // ANCHOR_END: decode_logs

    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_generic_struct:?}"),
    ];

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
async fn test_decode_logs_with_no_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let logs = contract_methods
        .initialize_counter(42)
        .call()
        .await?
        .decode_logs();

    assert!(logs.filter_succeeded().is_empty());

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    let call_handler_1 = contract_methods.produce_logs_values();
    let call_handler_2 = contract_methods.produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_log_multiple_contracts() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/logs/contract_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let call_handler_1 = contract_instance.methods().produce_logs_values();
    let call_handler_2 = contract_instance2.methods().produce_logs_variables();

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!(
            "{:?}",
            Bits256([
                239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161,
                16, 60, 239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
            ])
        ),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs"),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance2",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id.clone())
        .with_contracts(&[&contract_instance]);

    let call_handler_2 = contract_caller_instance2
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = multi_call_handler.call::<((), ())>().await?.decode_logs();

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

fn assert_revert_containing_msg(msg: &str, error: Error) {
    assert!(matches!(error, Error::Transaction(Reason::Reverted { .. })));
    if let Error::Transaction(Reason::Reverted { reason, .. }) = error {
        assert!(
            reason.contains(msg),
            "message: \"{msg}\" not contained in reason: \"{reason}\""
        );
    }
}

#[tokio::test]
async fn test_revert_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        ($method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .call()
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
        ($method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method()
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");

            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(require_primitive, call, "42");
        reverts_with_msg!(require_primitive, simulate, "42");

        reverts_with_msg!(require_string, call, "fuel");
        reverts_with_msg!(require_string, simulate, "fuel");

        reverts_with_msg!(require_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            require_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(require_with_additional_logs, call, "64");
        reverts_with_msg!(require_with_additional_logs, simulate, "64");
    }
    {
        reverts_with_msg!(rev_w_log_primitive, call, "42");
        reverts_with_msg!(rev_w_log_primitive, simulate, "42");

        reverts_with_msg!(rev_w_log_string, call, "fuel");
        reverts_with_msg!(rev_w_log_string, simulate, "fuel");

        reverts_with_msg!(rev_w_log_custom_generic, call, "StructDeeplyNestedGeneric");
        reverts_with_msg!(
            rev_w_log_custom_generic,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_single_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_multi_call_revert_logs_multi_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RevertLogsContract",
            project = "e2e/sway/contracts/revert_logs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "RevertLogsContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let contract_methods2 = contract_instance2.methods();

    // The output of the error depends on the order of the contract
    // handlers as the script returns the first revert it finds.
    {
        let call_handler_1 = contract_methods.require_string();
        let call_handler_2 = contract_methods2.rev_w_log_custom_generic();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("fuel", error);
    }
    {
        let call_handler_1 = contract_methods2.require_custom_generic();
        let call_handler_2 = contract_methods.rev_w_log_string();

        let mut multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let error = multi_call_handler
            .simulate::<((), ())>(Execution::Realistic)
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);

        let error = multi_call_handler
            .call::<((), ())>()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("StructDeeplyNestedGeneric", error);
    }

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_decode_logs() -> Result<()> {
    // ANCHOR: script_logs
    abigen!(Script(
        name = "LogScript",
        abi = "e2e/sway/logs/script_logs/out/release/script_logs-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/logs/script_logs/out/release/script_logs.bin";
    let instance = LogScript::new(wallet.clone(), bin_path);

    let response = instance.main().call().await?;

    let logs = response.decode_logs();
    let log_u64 = response.decode_logs_with_type::<u64>()?;
    // ANCHOR_END: script_logs

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_tuple = (expected_struct.clone(), expected_enum.clone());
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };
    let expected_logs: Vec<String> = vec![
        format!("{:?}", 128u64),
        format!("{:?}", 32u32),
        format!("{:?}", 16u16),
        format!("{:?}", 8u8),
        format!("{:?}", 64u64),
        format!("{expected_bits256:?}"),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
        format!("{expected_struct:?}"),
        format!("{expected_enum:?}"),
        format!("{expected_tuple:?}"),
        format!("{expected_generic_struct:?}"),
        format!("{expected_generic_enum:?}"),
        format!("{expected_nested_struct:?}"),
        format!("{expected_deeply_nested_struct:?}"),
    ];

    assert_eq!(logs.filter_succeeded(), expected_logs);

    Ok(())
}

#[tokio::test]
async fn test_contract_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/logs/contract_with_contract_logs",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/logs/contract_logs/out/release/contract_logs.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let expected_logs: Vec<String> = vec![
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
    ];

    let logs = contract_caller_instance
        .methods()
        .logs_from_external_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?
        .decode_logs();

    assert_eq!(expected_logs, logs.filter_succeeded());

    Ok(())
}

#[tokio::test]
#[allow(unused_variables)]
async fn test_script_logs_with_contract_logs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(name = "MyContract", project = "e2e/sway/logs/contract_logs",),
            Script(
                name = "LogScript",
                project = "e2e/sway/logs/script_with_contract_logs"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let expected_num_contract_logs = 4;

    let expected_script_logs: Vec<String> = vec![
        // Contract logs
        format!("{:?}", 64),
        format!("{:?}", 32),
        format!("{:?}", 16),
        format!("{:?}", 8),
        // Script logs
        format!("{:?}", true),
        format!("{:?}", 42),
        format!("{:?}", SizedAsciiString::<4>::new("Fuel".to_string())?),
        format!("{:?}", [1, 2, 3]),
    ];

    // ANCHOR: instance_to_contract_id
    let contract_id: ContractId = contract_instance.id().into();
    // ANCHOR_END: instance_to_contract_id

    // ANCHOR: external_contract_ids
    let response = script_instance
        .main(contract_id)
        .with_contract_ids(&[contract_id.into()])
        .call()
        .await?;
    // ANCHOR_END: external_contract_ids

    // ANCHOR: external_contract
    let response = script_instance
        .main(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?;
    // ANCHOR_END: external_contract

    {
        let num_contract_logs = response
            .receipts
            .iter()
            .filter(|receipt| matches!(receipt, Receipt::LogData { id, .. } | Receipt::Log { id, .. } if *id == contract_id))
            .count();

        assert_eq!(num_contract_logs, expected_num_contract_logs);
    }
    {
        let logs = response.decode_logs();

        assert_eq!(logs.filter_succeeded(), expected_script_logs);
    }

    Ok(())
}

#[tokio::test]
async fn test_script_decode_logs_with_type() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let response = script_instance.main().call().await?;

    let l = [1u8, 2u8, 3u8];
    let expected_bits256 = Bits256([
        239, 134, 175, 169, 105, 108, 240, 220, 99, 133, 226, 196, 7, 166, 225, 89, 161, 16, 60,
        239, 183, 226, 174, 6, 54, 251, 51, 211, 203, 42, 158, 74,
    ]);
    let expected_struct = TestStruct {
        field_1: true,
        field_2: expected_bits256,
        field_3: 64,
    };
    let expected_enum = TestEnum::VariantTwo;
    let expected_generic_struct = StructWithGeneric {
        field_1: expected_struct.clone(),
        field_2: 64,
    };

    let expected_generic_enum = EnumWithGeneric::VariantOne(l);
    let expected_nested_struct = StructWithNestedGeneric {
        field_1: expected_generic_struct.clone(),
        field_2: 64,
    };
    let expected_deeply_nested_struct = StructDeeplyNestedGeneric {
        field_1: expected_nested_struct.clone(),
        field_2: 64,
    };

    let log_u64 = response.decode_logs_with_type::<u64>()?;
    let log_u32 = response.decode_logs_with_type::<u32>()?;
    let log_u16 = response.decode_logs_with_type::<u16>()?;
    let log_u8 = response.decode_logs_with_type::<u8>()?;
    let log_struct = response.decode_logs_with_type::<TestStruct>()?;
    let log_enum = response.decode_logs_with_type::<TestEnum>()?;
    let log_generic_struct = response.decode_logs_with_type::<StructWithGeneric<TestStruct>>()?;
    let log_generic_enum = response.decode_logs_with_type::<EnumWithGeneric<[_; 3]>>()?;
    let log_nested_struct = response
        .decode_logs_with_type::<StructWithNestedGeneric<StructWithGeneric<TestStruct>>>()?;
    let log_deeply_nested_struct = response.decode_logs_with_type::<StructDeeplyNestedGeneric<
        StructWithNestedGeneric<StructWithGeneric<TestStruct>>,
    >>()?;
    // try to retrieve non existent log
    let log_nonexistent = response.decode_logs_with_type::<bool>()?;

    assert_eq!(log_u64, vec![128, 64]);
    assert_eq!(log_u32, vec![32]);
    assert_eq!(log_u16, vec![16]);
    assert_eq!(log_u8, vec![8]);
    assert_eq!(log_struct, vec![expected_struct]);
    assert_eq!(log_enum, vec![expected_enum]);
    assert_eq!(log_generic_struct, vec![expected_generic_struct]);
    assert_eq!(log_generic_enum, vec![expected_generic_enum]);
    assert_eq!(log_nested_struct, vec![expected_nested_struct]);
    assert_eq!(
        log_deeply_nested_struct,
        vec![expected_deeply_nested_struct]
    );
    assert!(log_nonexistent.is_empty());

    Ok(())
}

#[tokio::test]
async fn test_script_require_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_revert_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    {
        reverts_with_msg!(MatchEnum::RequirePrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RequirePrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RequireString, call, "fuel");
        reverts_with_msg!(MatchEnum::RequireString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RequireCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );

        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, call, "64");
        reverts_with_msg!(MatchEnum::RequireWithAdditionalLogs, simulate, "64");
    }
    {
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, call, "42");
        reverts_with_msg!(MatchEnum::RevWLogPrimitive, simulate, "42");

        reverts_with_msg!(MatchEnum::RevWLogString, call, "fuel");
        reverts_with_msg!(MatchEnum::RevWLogString, simulate, "fuel");

        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            call,
            "StructDeeplyNestedGeneric"
        );
        reverts_with_msg!(
            MatchEnum::RevWLogCustomGeneric,
            simulate,
            "StructDeeplyNestedGeneric"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let error = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_multi_call_contract_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Contract(
                name = "ContractLogs",
                project = "e2e/sway/logs/contract_logs",
            ),
            Contract(
                name = "ContractCaller",
                project = "e2e/sway/contracts/lib_contract_caller",
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "ContractLogs",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_caller_instance",
            contract = "ContractCaller",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_id = Contract::load_from(
        "./sway/contracts/lib_contract/out/release/lib_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let lib_contract_instance = MyContract::new(contract_id.clone(), wallet.clone());

    let call_handler_1 = contract_instance.methods().produce_logs_values();

    let call_handler_2 = contract_caller_instance
        .methods()
        .require_from_contract(contract_id)
        .with_contracts(&[&lib_contract_instance]);

    let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
        .add_call(call_handler_1)
        .add_call(call_handler_2);

    let error = multi_call_handler
        .call::<((), ())>()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_script_require_from_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        Deploy(
            name = "contract_instance",
            contract = "MyContract",
            wallet = "wallet",
            random_salt = false,
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

#[tokio::test]
async fn test_loader_script_require_from_loader_contract() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(
            Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/lib_contract",
            ),
            Script(
                name = "LogScript",
                project = "e2e/sway/scripts/require_from_contract"
            )
        ),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    let contract_binary = "sway/contracts/lib_contract/out/release/lib_contract.bin";
    let contract = Contract::load_from(contract_binary, LoadConfiguration::default())?;
    let contract_id = contract
        .convert_to_loader(100_000)?
        .deploy_if_not_exists(&wallet, TxPolicies::default())
        .await?;
    let contract_instance = MyContract::new(contract_id, wallet);

    let mut script_instance = script_instance;
    script_instance.convert_into_loader().await?;

    let error = script_instance
        .main(contract_instance.id())
        .with_contracts(&[&contract_instance])
        .call()
        .await
        .expect_err("should return a revert error");

    assert_revert_containing_msg("require from contract", error);

    Ok(())
}

fn assert_assert_eq_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left == right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

fn assert_assert_ne_containing_msg<T: std::fmt::Debug>(left: T, right: T, error: Error) {
    let msg = format!(
        "assertion failed: `(left != right)`\n left: `\"{left:?}\"`\n right: `\"{right:?}\"`"
    );
    assert_revert_containing_msg(&msg, error)
}

#[tokio::test]
async fn test_contract_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "LogContract",
            project = "e2e/sway/contracts/asserts"
        )),
        Deploy(
            name = "contract_instance",
            contract = "LogContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    macro_rules! reverts_with_msg {
        (($($arg: expr,)*), $method:ident, call, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        (($($arg: expr,)*), $method:ident, simulate, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!((32, 64,), assert_primitive, call, "assertion failed");
        reverts_with_msg!((32, 64,), assert_primitive, simulate, "assertion failed");
    }

    macro_rules! reverts_with_assert_eq_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_eq_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, call, "assertion failed");
        reverts_with_assert_eq_msg!((32, 64,), assert_eq_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_struct.clone(), test_struct2.clone(),),
            assert_eq_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;
        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_eq_msg!(
            (test_enum.clone(), test_enum2.clone(),),
            assert_eq_enum,
            simulate,
            "assertion failed"
        );
    }

    macro_rules! reverts_with_assert_ne_msg {
        (($($arg: expr,)*), $method:ident, $execution: ident, $msg:expr) => {
            let error = contract_instance
                .methods()
                .$method($($arg,)*)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_assert_ne_containing_msg($($arg,)* error);
        }
    }

    {
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, call, "assertion failed");
        reverts_with_assert_ne_msg!((32, 32,), assert_ne_primitive, simulate, "assertion failed");
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_struct.clone(), test_struct.clone(),),
            assert_ne_struct,
            simulate,
            "assertion failed"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            call,
            "assertion failed"
        );

        reverts_with_assert_ne_msg!(
            (test_enum.clone(), test_enum.clone(),),
            assert_ne_enum,
            simulate,
            "assertion failed"
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_script_asserts_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/scripts/script_asserts"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    macro_rules! reverts_with_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }

    macro_rules! reverts_with_assert_eq_ne_msg {
        ($arg:expr, call, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .call()
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
        ($arg:expr, simulate, $msg:expr) => {
            let error = script_instance
                .main($arg)
                .simulate(Execution::Realistic)
                .await
                .expect_err("should return a revert error");
            assert_revert_containing_msg($msg, error);
        };
    }
    {
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            call,
            "assertion failed"
        );
        reverts_with_msg!(
            MatchEnum::AssertPrimitive((32, 64)),
            simulate,
            "assertion failed"
        );
    }
    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqPrimitive((32, 64)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };

        let test_struct2 = TestStruct {
            field_1: false,
            field_2: 32,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqStruct((test_struct.clone(), test_struct2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;
        let test_enum2 = TestEnum::VariantTwo;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            call,
            "assertion failed: `(left == right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertEqEnum((test_enum.clone(), test_enum2.clone(),)),
            simulate,
            "assertion failed: `(left == right)`"
        );
    }

    {
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNePrimitive((32, 32)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_struct = TestStruct {
            field_1: true,
            field_2: 64,
        };
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeStruct((test_struct.clone(), test_struct.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }
    {
        let test_enum = TestEnum::VariantOne;

        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            call,
            "assertion failed: `(left != right)`"
        );
        reverts_with_assert_eq_ne_msg!(
            MatchEnum::AssertNeEnum((test_enum.clone(), test_enum.clone(),)),
            simulate,
            "assertion failed: `(left != right)`"
        );
    }

    Ok(())
}

#[tokio::test]
async fn contract_token_ops_error_messages() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/contracts/token_ops"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let contract_id = contract_instance.contract_id();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());
        let address = wallet.address();

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .simulate(Execution::Realistic)
            .await
            .expect_err("should return a revert error");
        assert_revert_containing_msg("failed transfer to address", error);

        let error = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .call()
            .await
            .expect_err("should return a revert error");

        assert_revert_containing_msg("failed transfer to address", error);
    }

    Ok(())
}

#[tokio::test]
async fn test_log_results() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let response = contract_instance
        .methods()
        .produce_bad_logs()
        .call()
        .await?;

    let log = response.decode_logs();

    let expected_err = format!(
        "codec: missing log formatter for log_id: `LogId({:?}, \"128\")`, data: `{:?}`. \
         Consider adding external contracts using `with_contracts()`",
        contract_instance.id().hash,
        [0u8; 8]
    );

    let succeeded = log.filter_succeeded();
    let failed = log.filter_failed();
    assert_eq!(succeeded, vec!["123".to_string()]);
    assert_eq!(failed.first().unwrap().to_string(), expected_err);

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_contract_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/contracts/needs_custom_decoder"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );

    let methods = contract_instance.methods();
    {
        // Single call: decoding with too low max_tokens fails
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "Should have failed since there are more tokens than what is supported by default.",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "Should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Single call: increasing limits makes the test pass
        let response = methods
            .i_log_a_1k_el_array()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }
    {
        // Multi call: decoding with too low max_tokens will fail
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        response.decode_logs_with_type::<[u8; 1000]>().expect_err(
            "should have failed since there are more tokens than what is supported by default",
        );

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty(), "should have had failed to decode logs since there are more tokens than what is supported by default");
    }
    {
        // Multi call: increasing limits makes the test pass
        let response = CallHandler::new_multi_call(wallet.clone())
            .add_call(methods.i_log_a_1k_el_array())
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call::<((),)>()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty());
    }

    Ok(())
}

#[tokio::test]
async fn can_configure_decoder_for_script_log_decoding() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_needs_custom_decoder_logging"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );

    {
        // Cannot decode the produced log with too low max_tokens
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 100,
                ..Default::default()
            })
            .call()
            .await?;

        response
            .decode_logs_with_type::<[u8; 1000]>()
            .expect_err("Cannot decode the log with default decoder config");

        let logs = response.decode_logs();
        assert!(!logs.filter_failed().is_empty())
    }
    {
        // When the token limit is bumped log decoding succeeds
        let response = script_instance
            .main()
            .with_decoder_config(DecoderConfig {
                max_tokens: 1001,
                ..Default::default()
            })
            .call()
            .await?;

        let logs = response.decode_logs_with_type::<[u8; 1000]>()?;
        assert_eq!(logs, vec![[0u8; 1000]]);

        let logs = response.decode_logs();
        assert!(!logs.filter_succeeded().is_empty())
    }

    Ok(())
}

#[tokio::test]
async fn contract_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "MyContract",
            project = "e2e/sway/logs/contract_logs"
        ),),
        Deploy(
            contract = "MyContract",
            name = "contract_instance",
            wallet = "wallet",
            random_salt = false,
        )
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.produce_string_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let response = contract_methods.produce_string_log().call().await?;
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let response = contract_methods.produce_bytes_log().call().await?;
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let response = contract_methods.produce_raw_slice_log().call().await?;
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let response = contract_methods.produce_vec_log().call().await?;
        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}

#[tokio::test]
async fn script_heap_log() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Script(
            name = "LogScript",
            project = "e2e/sway/logs/script_heap_logs"
        )),
        LoadScript(
            name = "script_instance",
            script = "LogScript",
            wallet = "wallet"
        )
    );
    let response = script_instance.main().call().await?;

    {
        let logs = response.decode_logs_with_type::<AsciiString>()?;

        assert_eq!("fuel".to_string(), logs.first().unwrap().to_string());
    }
    {
        let logs = response.decode_logs_with_type::<String>()?;

        assert_eq!(vec!["fuel".to_string()], logs);
    }
    {
        let logs = response.decode_logs_with_type::<Bytes>()?;

        assert_eq!(vec![Bytes("fuel".as_bytes().to_vec())], logs);
    }
    {
        let logs = response.decode_logs_with_type::<RawSlice>()?;

        assert_eq!(vec![RawSlice("fuel".as_bytes().to_vec())], logs);
    }
    {
        let v = [1u16, 2, 3].to_vec();
        let some_enum = EnumWithGeneric::VariantOne(v);
        let other_enum = EnumWithGeneric::VariantTwo;
        let v1 = vec![some_enum.clone(), other_enum, some_enum];
        let expected_vec = vec![vec![v1.clone(), v1]];

        let logs = response.decode_logs_with_type::<Vec<Vec<Vec<EnumWithGeneric<Vec<u16>>>>>>()?;

        assert_eq!(vec![expected_vec], logs);
    }

    Ok(())
}
```

## Convert to `Identity`

Convert an `Address` to an `Identity`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a `ContractId` to an `Identity`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `AssetId`

Convert a `[u8; 32]` array to an `AssetId`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a hex string to an `AssetId`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `Bech32`

Convert a `[u8; 32]` array to a `Bech32` address:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert `Bytes32` to a `Bech32` address:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert a string to a `Bech32` address:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert an `Address` to a `Bech32` address:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `str`

Convert a `ContractId` to a `str`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert an `Address` to a `str`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert an `AssetId` to a `str`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert `Bytes32` to a `str`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `Bits256`

Convert a hex string to `Bits256`:

```rust,ignore
use fuel_types::AssetId;
use fuels_macros::{Parameterize, Tokenizable, TryFrom};

use crate::types::errors::Result;

// A simple wrapper around [u8; 32] representing the `b256` type. Exists
// mainly so that we may differentiate `Parameterize` and `Tokenizable`
// implementations from what otherwise is just an array of 32 u8's.
#[derive(Debug, PartialEq, Eq, Copy, Clone)]
pub struct Bits256(pub [u8; 32]);

impl Bits256 {
    /// Returns `Self` with zeroes inside.
    pub fn zeroed() -> Self {
        Self([0; 32])
    }

    /// Create a new `Bits256` from a string representation of a hex.
    /// Accepts both `0x` prefixed and non-prefixed hex strings.
    pub fn from_hex_str(hex: &str) -> Result<Self> {
        let hex = if let Some(stripped_hex) = hex.strip_prefix("0x") {
            stripped_hex
        } else {
            hex
        };

        let mut bytes = [0u8; 32];
        hex::decode_to_slice(hex, &mut bytes as &mut [u8])?;

        Ok(Bits256(bytes))
    }
}

impl From<AssetId> for Bits256 {
    fn from(value: AssetId) -> Self {
        Self(value.into())
    }
}

// A simple wrapper around [Bits256; 2] representing the `B512` type.
#[derive(Debug, PartialEq, Eq, Copy, Clone, Parameterize, Tokenizable, TryFrom)]
#[FuelsCorePath = "crate"]
#[FuelsTypesPath = "crate::types"]
// ANCHOR: b512
pub struct B512 {
    pub bytes: [Bits256; 2],
}
// ANCHOR_END: b512

impl From<(Bits256, Bits256)> for B512 {
    fn from(bits_tuple: (Bits256, Bits256)) -> Self {
        B512 {
            bytes: [bits_tuple.0, bits_tuple.1],
        }
    }
}

#[derive(Debug, PartialEq, Eq, Copy, Clone, Parameterize, Tokenizable, TryFrom)]
#[FuelsCorePath = "crate"]
#[FuelsTypesPath = "crate::types"]
// ANCHOR: evm_address
pub struct EvmAddress {
    // An evm address is only 20 bytes, the first 12 bytes should be set to 0
    value: Bits256,
}
// ANCHOR_END: evm_address
impl EvmAddress {
    fn new(b256: Bits256) -> Self {
        Self {
            value: Bits256(Self::clear_12_bytes(b256.0)),
        }
    }

    pub fn value(&self) -> Bits256 {
        self.value
    }

    // sets the leftmost 12 bytes to zero
    fn clear_12_bytes(bytes: [u8; 32]) -> [u8; 32] {
        let mut bytes = bytes;
        bytes[..12].copy_from_slice(&[0u8; 12]);

        bytes
    }
}

impl From<Bits256> for EvmAddress {
    fn from(b256: Bits256) -> Self {
        EvmAddress::new(b256)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        traits::{Parameterize, Tokenizable},
        types::{param_types::ParamType, Token},
    };

    #[test]
    fn from_hex_str_b256() -> Result<()> {
        // ANCHOR: from_hex_str
        let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";

        let bits256 = Bits256::from_hex_str(hex_str)?;

        assert_eq!(bits256.0, [1u8; 32]);

        // With the `0x0` prefix
        // ANCHOR: hex_str_to_bits256
        let hex_str = "0x0101010101010101010101010101010101010101010101010101010101010101";

        let bits256 = Bits256::from_hex_str(hex_str)?;
        // ANCHOR_END: hex_str_to_bits256

        assert_eq!(bits256.0, [1u8; 32]);
        // ANCHOR_END: from_hex_str

        Ok(())
    }

    #[test]
    fn test_param_type_evm_addr() {
        assert_eq!(
            EvmAddress::param_type(),
            ParamType::Struct {
                name: "EvmAddress".to_string(),
                fields: vec![("value".to_string(), ParamType::B256)],
                generics: vec![]
            }
        );
    }

    #[test]
    fn evm_address_clears_first_12_bytes() -> Result<()> {
        let data = [1u8; 32];
        let address = EvmAddress::new(Bits256(data));

        let expected_data = Bits256([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1,
        ]);

        assert_eq!(address.value(), expected_data);

        Ok(())
    }

    #[test]
    fn test_into_token_evm_addr() {
        let bits = [1u8; 32];
        let evm_address = EvmAddress::from(Bits256(bits));

        let token = evm_address.into_token();

        let expected_data = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1,
        ];

        assert_eq!(token, Token::Struct(vec![Token::B256(expected_data)]));
    }
}
```

Convert a `ContractId` to `Bits256`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert an `Address` to `Bits256`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

Convert an `AssetId` to `Bits256`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

## Convert to `Bytes`

Convert a string to `Bytes`:

```rust,ignore
use crate::types::errors::Result;

#[derive(Debug, PartialEq, Clone, Eq)]
pub struct Bytes(pub Vec<u8>);

impl Bytes {
    /// Create a new `Bytes` from a string representation of a hex.
    /// Accepts both `0x` prefixed and non-prefixed hex strings.
    pub fn from_hex_str(hex: &str) -> Result<Self> {
        let hex = if let Some(stripped_hex) = hex.strip_prefix("0x") {
            stripped_hex
        } else {
            hex
        };
        let bytes = hex::decode(hex)?;

        Ok(Bytes(bytes))
    }
}

impl From<Bytes> for Vec<u8> {
    fn from(bytes: Bytes) -> Vec<u8> {
        bytes.0
    }
}

impl PartialEq<Vec<u8>> for Bytes {
    fn eq(&self, other: &Vec<u8>) -> bool {
        self.0 == *other
    }
}

impl PartialEq<Bytes> for Vec<u8> {
    fn eq(&self, other: &Bytes) -> bool {
        *self == other.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn from_hex_str_b256() -> Result<()> {
        // ANCHOR: bytes_from_hex_str
        let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";

        let bytes = Bytes::from_hex_str(hex_str)?;

        assert_eq!(bytes.0, vec![1u8; 32]);

        // With the `0x0` prefix
        // ANCHOR: hex_string_to_bytes32
        let hex_str = "0x0101010101010101010101010101010101010101010101010101010101010101";

        let bytes = Bytes::from_hex_str(hex_str)?;
        // ANCHOR_END: hex_string_to_bytes32

        assert_eq!(bytes.0, vec![1u8; 32]);
        // ANCHOR_END: bytes_from_hex_str

        Ok(())
    }
}
```

## Convert to `B512`

Convert two hex strings to `B512`:

```rust,ignore
use std::str::FromStr;

use fuels::{
    prelude::*,
    types::{Bits256, EvmAddress, Identity, SizedAsciiString, B512, U256},
};

pub fn null_contract_id() -> Bech32ContractId {
    // a bech32 contract address that decodes to [0u8;32]
    Bech32ContractId::from_str("fuel1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsx2mt2")
        .expect("is valid")
}

#[tokio::test]
async fn test_methods_typeless_argument() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/empty_arguments"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let response = contract_instance
        .methods()
        .method_with_empty_argument()
        .call()
        .await?;

    assert_eq!(response.value, 63);

    Ok(())
}

#[tokio::test]
async fn call_with_empty_return() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TestContract",
            project = "e2e/sway/types/contracts/call_empty_return"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TestContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let _response = contract_instance.methods().store_value(42).call().await?;
    Ok(())
}

#[tokio::test]
async fn call_with_structs() -> Result<()> {
    // Generates the bindings from the an ABI definition inline.
    // The generated bindings can be accessed through `MyContract`.
    // ANCHOR: struct_generation
    abigen!(Contract(name="MyContract",
                     abi="e2e/sway/types/contracts/complex_types_contract/out/release/complex_types_contract-abi.json"));

    // Here we can use `CounterConfig`, a struct originally
    // defined in the contract.
    let counter_config = CounterConfig {
        dummy: true,
        initial_value: 42,
    };
    // ANCHOR_END: struct_generation

    let wallet = launch_provider_and_get_wallet().await?;

    let contract_id = Contract::load_from(
        "sway/types/contracts/complex_types_contract/out/release/complex_types_contract.bin",
        LoadConfiguration::default(),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_methods = MyContract::new(contract_id, wallet).methods();

    let response = contract_methods
        .initialize_counter(counter_config)
        .call()
        .await?;

    assert_eq!(42, response.value);

    let response = contract_methods.increment_counter(10).call().await?;

    assert_eq!(52, response.value);

    Ok(())
}

#[tokio::test]
async fn abigen_different_structs_same_arg_name() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/two_structs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let param_one = StructOne { foo: 42 };
    let param_two = StructTwo { bar: 42 };

    let contract_methods = contract_instance.methods();
    let res_one = contract_methods.something(param_one).call().await?;

    assert_eq!(res_one.value, 43);

    let res_two = contract_methods.something_else(param_two).call().await?;

    assert_eq!(res_two.value, 41);
    Ok(())
}

#[tokio::test]
async fn nested_structs() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/nested_structs"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let expected = AllStruct {
        some_struct: SomeStruct {
            field: 12345,
            field_2: true,
        },
    };

    let contract_methods = contract_instance.methods();
    let actual = contract_methods.get_struct().call().await?.value;
    assert_eq!(actual, expected);

    let fuelvm_judgement = contract_methods
        .check_struct_integrity(expected)
        .call()
        .await?
        .value;

    assert!(
        fuelvm_judgement,
        "The FuelVM deems that we've not encoded the argument correctly. Investigate!"
    );

    let memory_address = MemoryAddress {
        contract_id: ContractId::zeroed(),
        function_selector: 10,
        function_data: 0,
    };

    let call_data = CallData {
        memory_address,
        num_coins_to_forward: 10,
        asset_id_of_coins_to_forward: ContractId::zeroed(),
        amount_of_gas_to_forward: 5,
    };

    let actual = contract_methods
        .nested_struct_with_reserved_keyword_substring(call_data.clone())
        .call()
        .await?
        .value;

    assert_eq!(actual, call_data);
    Ok(())
}

#[tokio::test]
async fn calls_with_empty_struct() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/complex_types_contract"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.get_empty_struct().call().await?;

        assert_eq!(response.value, EmptyStruct {});
    }
    {
        let response = contract_methods
            .input_empty_struct(EmptyStruct {})
            .call()
            .await?;

        assert!(response.value);
    }

    Ok(())
}

#[tokio::test]
async fn can_use_try_into_to_construct_struct_from_bytes() -> Result<()> {
    abigen!(Contract(
        name = "MyContract",
        abi = "e2e/sway/types/contracts/enum_inside_struct/out/release\
        /enum_inside_struct-abi.json"
    ));
    let cocktail_in_bytes: Vec<u8> = vec![
        0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3,
    ];

    let expected = Cocktail {
        the_thing_you_mix_in: Shaker::Mojito(2),
        glass: 3,
    };

    // as slice
    let actual: Cocktail = cocktail_in_bytes[..].try_into()?;
    assert_eq!(actual, expected);

    // as ref
    let actual: Cocktail = (&cocktail_in_bytes).try_into()?;
    assert_eq!(actual, expected);

    // as value
    let actual: Cocktail = cocktail_in_bytes.try_into()?;
    assert_eq!(actual, expected);
    Ok(())
}

#[tokio::test]
async fn test_tuples() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/tuples"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let response = contract_methods.returns_tuple((1, 2)).call().await?;

        assert_eq!(response.value, (1, 2));
    }
    {
        // Tuple with struct.
        let my_struct_tuple = (
            42,
            Person {
                name: "Jane".try_into()?,
            },
        );
        let response = contract_methods
            .returns_struct_in_tuple(my_struct_tuple.clone())
            .call()
            .await?;

        assert_eq!(response.value, my_struct_tuple);
    }
    {
        // Tuple with enum.
        let my_enum_tuple: (u64, State) = (42, State::A);

        let response = contract_methods
            .returns_enum_in_tuple(my_enum_tuple.clone())
            .call()
            .await?;

        assert_eq!(response.value, my_enum_tuple);
    }
    {
        // Tuple with single element
        let my_enum_tuple = (123u64,);

        let response = contract_methods
            .single_element_tuple(my_enum_tuple)
            .call()
            .await?;

        assert_eq!(response.value, my_enum_tuple);
    }
    {
        // tuple with b256
        let id = *ContractId::zeroed();
        let my_b256_u8_tuple = (Bits256(id), 10);

        let response = contract_methods
            .tuple_with_b256(my_b256_u8_tuple)
            .call()
            .await?;

        assert_eq!(response.value, my_b256_u8_tuple);
    }

    Ok(())
}

#[tokio::test]
async fn test_evm_address() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/evm_address"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    {
        // ANCHOR: evm_address_arg
        let b256 = Bits256::from_hex_str(
            "0x1616060606060606060606060606060606060606060606060606060606060606",
        )?;
        let evm_address = EvmAddress::from(b256);

        let call_handler = contract_instance
            .methods()
            .evm_address_as_input(evm_address);
        // ANCHOR_END: evm_address_arg

        assert!(call_handler.call().await?.value);
    }

    {
        let b256 = Bits256::from_hex_str(
            "0x0606060606060606060606060606060606060606060606060606060606060606",
        )?;
        let expected_evm_address = EvmAddress::from(b256);

        assert_eq!(
            contract_instance
                .methods()
                .evm_address_from_literal()
                .call()
                .await?
                .value,
            expected_evm_address
        );
    }

    {
        let b256 = Bits256::from_hex_str(
            "0x0606060606060606060606060606060606060606060606060606060606060606",
        )?;
        let expected_evm_address = EvmAddress::from(b256);

        assert_eq!(
            contract_instance
                .methods()
                .evm_address_from_argument(b256)
                .call()
                .await?
                .value,
            expected_evm_address
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_array() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    assert_eq!(
        contract_instance
            .methods()
            .get_array([42; 2])
            .call()
            .await?
            .value,
        [42; 2]
    );
    Ok(())
}

#[tokio::test]
async fn test_arrays_with_custom_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/contracts/contract_test"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let persons = [
        Person {
            name: "John".try_into()?,
        },
        Person {
            name: "Jane".try_into()?,
        },
    ];

    let contract_methods = contract_instance.methods();
    let response = contract_methods.array_of_structs(persons).call().await?;

    assert_eq!("John", response.value[0].name);
    assert_eq!("Jane", response.value[1].name);

    let states = [State::A, State::B];

    let response = contract_methods
        .array_of_enums(states.clone())
        .call()
        .await?;

    assert_eq!(states[0], response.value[0]);
    assert_eq!(states[1], response.value[1]);
    Ok(())
}

#[tokio::test]
async fn str_in_array() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/str_in_array"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let input = ["foo", "bar", "baz"].map(|str| str.try_into().unwrap());
    let contract_methods = contract_instance.methods();
    let response = contract_methods
        .take_array_string_shuffle(input.clone())
        .call()
        .await?;

    assert_eq!(response.value, ["baz", "foo", "bar"]);

    let response = contract_methods
        .take_array_string_return_single(input.clone())
        .call()
        .await?;

    assert_eq!(response.value, ["foo"]);

    let response = contract_methods
        .take_array_string_return_single_element(input)
        .call()
        .await?;

    assert_eq!(response.value, "bar");
    Ok(())
}

#[tokio::test]
async fn test_enum_inside_struct() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/enum_inside_struct"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let expected = Cocktail {
        the_thing_you_mix_in: Shaker::Mojito(11),
        glass: 333,
    };

    let contract_methods = contract_instance.methods();
    let response = contract_methods
        .return_enum_inside_struct(11)
        .call()
        .await?;

    assert_eq!(response.value, expected);

    let enum_inside_struct = Cocktail {
        the_thing_you_mix_in: Shaker::Cosmopolitan(444),
        glass: 555,
    };

    let response = contract_methods
        .take_enum_inside_struct(enum_inside_struct)
        .call()
        .await?;

    assert_eq!(response.value, 555);
    Ok(())
}

#[tokio::test]
async fn native_types_support() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/native_types"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let user = User {
        weight: 10,
        address: Address::zeroed(),
    };

    let contract_methods = contract_instance.methods();
    let response = contract_methods.wrapped_address(user).call().await?;

    assert_eq!(response.value.address, Address::zeroed());

    let response = contract_methods
        .unwrapped_address(Address::zeroed())
        .call()
        .await?;

    assert_eq!(
        response.value,
        Address::from_str("0x0000000000000000000000000000000000000000000000000000000000000000")?
    );

    Ok(())
}

#[tokio::test]
async fn enum_coding_w_variable_width_variants() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/enum_encoding"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // If we had a regression on the issue of enum encoding width, then we'll
    // probably end up mangling arg_2 and onward which will fail this test.
    let expected = BigBundle {
        arg_1: EnumThatHasABigAndSmallVariant::Small(12345),
        arg_2: 6666,
        arg_3: 7777,
        arg_4: 8888,
    };

    let contract_methods = contract_instance.methods();
    let actual = contract_methods.get_big_bundle().call().await?.value;
    assert_eq!(actual, expected);

    let fuelvm_judgement = contract_methods
        .check_big_bundle_integrity(expected)
        .call()
        .await?
        .value;

    assert!(
        fuelvm_judgement,
        "The FuelVM deems that we've not encoded the bundle correctly. Investigate!"
    );
    Ok(())
}

#[tokio::test]
async fn enum_coding_w_unit_enums() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/enum_encoding"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // If we had a regression on the issue of unit enum encoding width, then
    // we'll end up mangling arg_2
    let expected = UnitBundle {
        arg_1: UnitEnum::var2,
        arg_2: u64::MAX,
    };

    let contract_methods = contract_instance.methods();
    let actual = contract_methods.get_unit_bundle().call().await?.value;
    assert_eq!(actual, expected);

    let fuelvm_judgement = contract_methods
        .check_unit_bundle_integrity(expected)
        .call()
        .await?
        .value;

    assert!(
        fuelvm_judgement,
        "The FuelVM deems that we've not encoded the bundle correctly. Investigate!"
    );
    Ok(())
}

#[tokio::test]
async fn enum_as_input() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/enum_as_input"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let expected = MaxedOutVariantsEnum::Variant255(11);
    let contract_methods = contract_instance.methods();
    let actual = contract_methods.get_max_variant().call().await?.value;
    assert_eq!(expected, actual);

    let expected = StandardEnum::Two(12345);
    let contract_methods = contract_instance.methods();
    let actual = contract_methods.get_standard_enum().call().await?.value;
    assert_eq!(expected, actual);

    let fuelvm_judgement = contract_methods
        .check_standard_enum_integrity(expected)
        .call()
        .await?
        .value;
    assert!(
        fuelvm_judgement,
        "The FuelVM deems that we've not encoded the standard enum correctly. Investigate!"
    );

    let expected = UnitEnum::Two;
    let actual = contract_methods.get_unit_enum().call().await?.value;
    assert_eq!(actual, expected);

    let fuelvm_judgement = contract_methods
        .check_unit_enum_integrity(expected)
        .call()
        .await?
        .value;
    assert!(
        fuelvm_judgement,
        "The FuelVM deems that we've not encoded the unit enum correctly. Investigate!"
    );
    Ok(())
}

#[tokio::test]
async fn can_use_try_into_to_construct_enum_from_bytes() -> Result<()> {
    abigen!(Contract(
        name = "MyContract",
        abi = "e2e/sway/types/contracts/enum_inside_struct/out/release\
        /enum_inside_struct-abi.json"
    ));
    let shaker_in_bytes: Vec<u8> = vec![0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2];

    let expected = Shaker::Mojito(2);

    // as slice
    let actual: Shaker = shaker_in_bytes[..].try_into()?;
    assert_eq!(actual, expected);

    // as ref
    let actual: Shaker = (&shaker_in_bytes).try_into()?;
    assert_eq!(actual, expected);

    // as value
    let actual: Shaker = shaker_in_bytes.try_into()?;
    assert_eq!(actual, expected);
    Ok(())
}

#[tokio::test]
async fn type_inside_enum() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/type_inside_enum"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    // String inside enum
    let enum_string = SomeEnum::SomeStr("asdf".try_into()?);
    let contract_methods = contract_instance.methods();
    let response = contract_methods
        .str_inside_enum(enum_string.clone())
        .call()
        .await?;
    assert_eq!(response.value, enum_string);

    // Array inside enum
    let enum_array = SomeEnum::SomeArr([1, 2, 3, 4]);
    let response = contract_methods
        .arr_inside_enum(enum_array.clone())
        .call()
        .await?;
    assert_eq!(response.value, enum_array);

    // Struct inside enum
    let response = contract_methods
        .return_struct_inside_enum(11)
        .call()
        .await?;
    let expected = Shaker::Cosmopolitan(Recipe { ice: 22, sugar: 11 });
    assert_eq!(response.value, expected);

    let struct_inside_enum = Shaker::Cosmopolitan(Recipe { ice: 22, sugar: 66 });
    let response = contract_methods
        .take_struct_inside_enum(struct_inside_enum)
        .call()
        .await?;
    assert_eq!(response.value, 8888);

    // Enum inside enum
    let expected_enum = EnumLevel3::El2(EnumLevel2::El1(EnumLevel1::Num(42)));
    let response = contract_methods.get_nested_enum().call().await?;
    assert_eq!(response.value, expected_enum);

    let response = contract_methods
        .check_nested_enum_integrity(expected_enum)
        .call()
        .await?;
    assert!(
        response.value,
        "The FuelVM deems that we've not encoded the nested enum correctly. Investigate!"
    );

    Ok(())
}

#[tokio::test]
async fn test_rust_option_can_be_decoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/options"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let s = TestStruct {
        option: Some(expected_address),
    };

    let e = TestEnum::EnumOption(Some(expected_address));

    let expected_some_address = Some(expected_address);
    let response = contract_methods.get_some_address().call().await?;

    assert_eq!(response.value, expected_some_address);

    let expected_some_u64 = Some(10);
    let response = contract_methods.get_some_u64().call().await?;

    assert_eq!(response.value, expected_some_u64);

    let response = contract_methods.get_some_struct().call().await?;
    assert_eq!(response.value, Some(s.clone()));

    let response = contract_methods.get_some_enum().call().await?;
    assert_eq!(response.value, Some(e.clone()));

    let response = contract_methods.get_some_tuple().call().await?;
    assert_eq!(response.value, Some((s.clone(), e.clone())));

    let expected_none = None;
    let response = contract_methods.get_none().call().await?;

    assert_eq!(response.value, expected_none);

    Ok(())
}

#[tokio::test]
async fn test_rust_option_can_be_encoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/options"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let s = TestStruct {
        option: Some(expected_address),
    };

    let e = TestEnum::EnumOption(Some(expected_address));

    let expected_u64 = Some(36);
    let response = contract_methods
        .input_primitive(expected_u64)
        .call()
        .await?;

    assert!(response.value);

    let expected_struct = Some(s);
    let response = contract_methods
        .input_struct(expected_struct)
        .call()
        .await?;

    assert!(response.value);

    let expected_enum = Some(e);
    let response = contract_methods.input_enum(expected_enum).call().await?;

    assert!(response.value);

    let expected_none = None;
    let response = contract_methods.input_none(expected_none).call().await?;

    assert!(response.value);

    Ok(())
}

#[tokio::test]
async fn test_rust_result_can_be_decoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/results"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let s = TestStruct {
        option: Some(expected_address),
    };

    let e = TestEnum::EnumOption(Some(expected_address));

    let expected_ok_address = Ok(expected_address);
    let response = contract_methods.get_ok_address().call().await?;

    assert_eq!(response.value, expected_ok_address);

    let expected_some_u64 = Ok(10);
    let response = contract_methods.get_ok_u64().call().await?;

    assert_eq!(response.value, expected_some_u64);

    let response = contract_methods.get_ok_struct().call().await?;
    assert_eq!(response.value, Ok(s.clone()));

    let response = contract_methods.get_ok_enum().call().await?;
    assert_eq!(response.value, Ok(e.clone()));

    let response = contract_methods.get_ok_tuple().call().await?;
    assert_eq!(response.value, Ok((s, e)));

    let expected_error = Err(TestError::NoAddress("error".try_into().unwrap()));
    let response = contract_methods.get_error().call().await?;

    assert_eq!(response.value, expected_error);

    Ok(())
}

#[tokio::test]
async fn test_rust_result_can_be_encoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/results"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let expected_ok_address = Ok(expected_address);
    let response = contract_methods
        .input_ok(expected_ok_address)
        .call()
        .await?;

    assert!(response.value);

    let expected_error = Err(TestError::NoAddress("error".try_into().unwrap()));
    let response = contract_methods.input_error(expected_error).call().await?;

    assert!(response.value);

    Ok(())
}

#[tokio::test]
async fn test_identity_can_be_decoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/identity"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;
    let expected_contract_id =
        ContractId::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let s = TestStruct {
        identity: Identity::Address(expected_address),
    };

    let e = TestEnum::EnumIdentity(Identity::ContractId(expected_contract_id));

    let response = contract_methods.get_identity_address().call().await?;
    assert_eq!(response.value, Identity::Address(expected_address));

    let response = contract_methods.get_identity_contract_id().call().await?;
    assert_eq!(response.value, Identity::ContractId(expected_contract_id));

    let response = contract_methods.get_struct_with_identity().call().await?;
    assert_eq!(response.value, s.clone());

    let response = contract_methods.get_enum_with_identity().call().await?;
    assert_eq!(response.value, e.clone());

    let response = contract_methods.get_identity_tuple().call().await?;
    assert_eq!(response.value, (s, e));

    Ok(())
}

#[tokio::test]
async fn test_identity_can_be_encoded() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/identity"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;
    let expected_contract_id =
        ContractId::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    let s = TestStruct {
        identity: Identity::Address(expected_address),
    };

    let e = TestEnum::EnumIdentity(Identity::ContractId(expected_contract_id));

    let response = contract_methods
        .input_identity(Identity::Address(expected_address))
        .call()
        .await?;

    assert!(response.value);

    let response = contract_methods
        .input_struct_with_identity(s)
        .call()
        .await?;

    assert!(response.value);

    let response = contract_methods.input_enum_with_identity(e).call().await?;

    assert!(response.value);

    Ok(())
}

#[tokio::test]
async fn test_identity_with_two_contracts() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/identity"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
        Deploy(
            name = "contract_instance2",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let expected_address =
        Address::from_str("0xd58573593432a30a800f97ad32f877425c223a9e427ab557aab5d5bb89156db0")?;

    {
        let response = contract_instance
            .methods()
            .input_identity(Identity::Address(expected_address))
            .call()
            .await?;

        assert!(response.value);
    }
    {
        let response = contract_instance2
            .methods()
            .input_identity(Identity::Address(expected_address))
            .call()
            .await?;

        assert!(response.value);
    }

    Ok(())
}

#[tokio::test]
async fn generics_test() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/generics"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        // ANCHOR: generic
        // simple struct with a single generic param
        let arg1 = SimpleGeneric {
            single_generic_param: 123u64,
        };

        let result = contract_methods
            .struct_w_generic(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
        // ANCHOR_END: generic
    }
    {
        // struct that delegates the generic param internally
        let arg1 = PassTheGenericOn {
            one: SimpleGeneric {
                single_generic_param: "abc".try_into()?,
            },
        };

        let result = contract_methods
            .struct_delegating_generic(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
    }
    {
        // struct that has the generic in an array
        let arg1 = StructWArrayGeneric { a: [1u32, 2u32] };

        let result = contract_methods
            .struct_w_generic_in_array(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
    }
    {
        // struct that has a generic struct in an array
        let inner = [
            StructWTwoGenerics {
                a: Bits256([1u8; 32]),
                b: 1,
            },
            StructWTwoGenerics {
                a: Bits256([2u8; 32]),
                b: 2,
            },
            StructWTwoGenerics {
                a: Bits256([3u8; 32]),
                b: 3,
            },
        ];
        let arg1 = StructWArrWGenericStruct { a: inner };

        let result = contract_methods
            .array_with_generic_struct(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
    }
    {
        // struct that has the generic in a tuple
        let arg1 = StructWTupleGeneric { a: (1, 2) };

        let result = contract_methods
            .struct_w_generic_in_tuple(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
    }
    {
        // enum with generic in variant
        let arg1 = EnumWGeneric::B(10);
        let result = contract_methods
            .enum_w_generic(arg1.clone())
            .call()
            .await?
            .value;

        assert_eq!(result, arg1);
    }
    {
        contract_methods
            .unused_generic_args(StructUnusedGeneric::new(15), EnumUnusedGeneric::One(15))
            .call()
            .await?;

        let (the_struct, the_enum) = contract_methods
            .used_and_unused_generic_args(
                StructUsedAndUnusedGenericParams::new(10u8),
                EnumUsedAndUnusedGenericParams::Two(11u8),
            )
            .call()
            .await?
            .value;

        assert_eq!(the_struct.field, 12u8);
        if let EnumUsedAndUnusedGenericParams::Two(val) = the_enum {
            assert_eq!(val, 13)
        } else {
            panic!("Expected the variant EnumUsedAndUnusedGenericParams::Two");
        }
    }
    {
        // complex case
        let pass_through = PassTheGenericOn {
            one: SimpleGeneric {
                single_generic_param: "ab".try_into()?,
            },
        };
        let w_arr_generic = StructWArrayGeneric {
            a: [pass_through.clone(), pass_through],
        };

        let arg1 = MegaExample {
            a: ([Bits256([0; 32]), Bits256([0; 32])], "ab".try_into()?),
            b: vec![(
                [EnumWGeneric::B(StructWTupleGeneric {
                    a: (w_arr_generic.clone(), w_arr_generic),
                })],
                10u32,
            )],
        };
        contract_methods.complex_test(arg1.clone()).call().await?;
    }

    Ok(())
}

#[tokio::test]
async fn contract_vectors() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/vectors"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let methods = contract_instance.methods();

    {
        // vec of u32s
        let arg = vec![0, 1, 2];
        methods.u32_vec(arg).call().await?;
    }
    {
        // vec of vecs of u32s
        let arg = vec![vec![0, 1, 2], vec![0, 1, 2]];
        methods.vec_in_vec(arg.clone()).call().await?;
    }
    {
        // vec of structs
        // ANCHOR: passing_in_vec
        let arg = vec![SomeStruct { a: 0 }, SomeStruct { a: 1 }];
        methods.struct_in_vec(arg.clone()).call().await?;
        // ANCHOR_END: passing_in_vec
    }
    {
        // vec in struct
        let arg = SomeStruct { a: vec![0, 1, 2] };
        methods.vec_in_struct(arg.clone()).call().await?;
    }
    {
        // array in vec
        let arg = vec![[0u64, 1u64], [0u64, 1u64]];
        methods.array_in_vec(arg.clone()).call().await?;
    }
    {
        // vec in array
        let arg = [vec![0, 1, 2], vec![0, 1, 2]];
        methods.vec_in_array(arg.clone()).call().await?;
    }
    {
        // vec in enum
        let arg = SomeEnum::a(vec![0, 1, 2]);
        methods.vec_in_enum(arg.clone()).call().await?;
    }
    {
        // enum in vec
        let arg = vec![SomeEnum::a(0), SomeEnum::a(1)];
        methods.enum_in_vec(arg.clone()).call().await?;
    }
    {
        // tuple in vec
        let arg = vec![(0, 0), (1, 1)];
        methods.tuple_in_vec(arg.clone()).call().await?;
    }
    {
        // vec in tuple
        let arg = (vec![0, 1, 2], vec![0, 1, 2]);
        methods.vec_in_tuple(arg.clone()).call().await?;
    }
    {
        // vec in a vec in a struct in a vec
        let arg = vec![
            SomeStruct {
                a: vec![vec![0, 1, 2], vec![3, 4, 5]],
            },
            SomeStruct {
                a: vec![vec![6, 7, 8], vec![9, 10, 11]],
            },
        ];
        methods
            .vec_in_a_vec_in_a_struct_in_a_vec(arg.clone())
            .call()
            .await?;
    }

    Ok(())
}

#[tokio::test]
async fn test_b256() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/b256"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    assert_eq!(
        Bits256([2; 32]),
        contract_instance
            .methods()
            .b256_as_output()
            .call()
            .await?
            .value
    );

    {
        // ANCHOR: 256_arg
        let b256 = Bits256([1; 32]);

        let call_handler = contract_instance.methods().b256_as_input(b256);
        // ANCHOR_END: 256_arg

        assert!(call_handler.call().await?.value);
    }

    Ok(())
}

#[tokio::test]
async fn test_b512() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/b512"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    // ANCHOR: b512_example
    let hi_bits = Bits256::from_hex_str(
        "0xbd0c9b8792876713afa8bff383eebf31c43437823ed761cc3600d0016de5110c",
    )?;
    let lo_bits = Bits256::from_hex_str(
        "0x44ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d",
    )?;
    let b512 = B512::from((hi_bits, lo_bits));
    // ANCHOR_END: b512_example

    assert_eq!(b512, contract_methods.b512_as_output().call().await?.value);

    {
        let lo_bits2 = Bits256::from_hex_str(
            "0x54ac566bd156b4fc71a4a4cb2655d3dd360c695edb17dc3b64d611e122fea23d",
        )?;
        let b512 = B512::from((hi_bits, lo_bits2));

        assert!(contract_methods.b512_as_input(b512).call().await?.value);
    }

    Ok(())
}

fn u128_from(parts: (u64, u64)) -> u128 {
    let bytes: [u8; 16] = [parts.0.to_be_bytes(), parts.1.to_be_bytes()]
        .concat()
        .try_into()
        .unwrap();
    u128::from_be_bytes(bytes)
}

#[tokio::test]
async fn test_u128() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/u128"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();
    {
        let arg = u128_from((1, 2));

        let actual = contract_methods.u128_sum_and_ret(arg).call().await?.value;

        let expected = arg + u128_from((3, 4));

        assert_eq!(expected, actual);
    }
    {
        let actual = contract_methods.u128_in_enum_output().call().await?.value;

        let expected = SomeEnum::B(u128_from((4, 4)));
        assert_eq!(expected, actual);
    }
    {
        let input = SomeEnum::B(u128_from((3, 3)));

        contract_methods.u128_in_enum_input(input).call().await?;
    }

    Ok(())
}

fn u256_from(parts: (u64, u64, u64, u64)) -> U256 {
    let bytes: [u8; 32] = [
        parts.0.to_be_bytes(),
        parts.1.to_be_bytes(),
        parts.2.to_be_bytes(),
        parts.3.to_be_bytes(),
    ]
    .concat()
    .try_into()
    .unwrap();
    U256::from(bytes)
}

#[tokio::test]
async fn test_u256() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "TypesContract",
            project = "e2e/sway/types/contracts/u256"
        )),
        Deploy(
            name = "contract_instance",
            contract = "TypesContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();
    {
        let arg = u256_from((1, 2, 3, 4));
        let actual = contract_methods.u256_sum_and_ret(arg).call().await?.value;
        let expected = arg + u256_from((3, 4, 5, 6));

        assert_eq!(expected, actual);
    }
    {
        let actual = contract_methods.u256_in_enum_output().call().await?.value;
        let expected = SomeEnum::B(u256_from((1, 2, 3, 4)));

        assert_eq!(expected, actual);
    }
    {
        let input = SomeEnum::B(u256_from((2, 3, 4, 5)));

        contract_methods.u256_in_enum_input(input).call().await?;
    }

    Ok(())
}

#[tokio::test]
async fn test_base_type_in_vec_output() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "VectorOutputContract",
            project = "e2e/sway/types/contracts/vector_output"
        )),
        Deploy(
            name = "contract_instance",
            contract = "VectorOutputContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    // ANCHOR: returning_vec
    let response = contract_methods.u8_in_vec(10).call().await?;
    assert_eq!(response.value, (0..10).collect::<Vec<_>>());
    // ANCHOR_END: returning_vec

    let response = contract_methods.u16_in_vec(11).call().await?;
    assert_eq!(response.value, (0..11).collect::<Vec<_>>());

    let response = contract_methods.u32_in_vec(12).call().await?;
    assert_eq!(response.value, (0..12).collect::<Vec<_>>());

    let response = contract_methods.u64_in_vec(13).call().await?;
    assert_eq!(response.value, (0..13).collect::<Vec<_>>());

    let response = contract_methods.bool_in_vec().call().await?;
    assert_eq!(response.value, [true, false, true, false].to_vec());

    let response = contract_methods.b256_in_vec(13).call().await?;
    assert_eq!(response.value, vec![Bits256([2; 32]); 13]);

    Ok(())
}

#[tokio::test]
async fn test_composite_types_in_vec_output() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "VectorOutputContract",
            project = "e2e/sway/types/contracts/vector_output"
        )),
        Deploy(
            name = "contract_instance",
            contract = "VectorOutputContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let expected: Vec<[u64; 4]> = vec![[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4]];
        let response = contract_methods.array_in_vec().call().await?.value;
        assert_eq!(response, expected);
    }
    {
        let expected: Vec<Pasta> = vec![
            Pasta::Tortelini(Bimbam {
                bim: 1111,
                bam: 2222_u32,
            }),
            Pasta::Rigatoni(1987),
            Pasta::Spaghetti(true),
        ];

        let response = contract_methods.enum_in_vec().call().await?.value;
        assert_eq!(response, expected);
    }

    {
        let expected: Vec<Bimbam> = vec![
            Bimbam {
                bim: 1111,
                bam: 2222_u32,
            },
            Bimbam {
                bim: 3333,
                bam: 4444_u32,
            },
            Bimbam {
                bim: 5555,
                bam: 6666_u32,
            },
        ];
        let response = contract_methods.struct_in_vec().call().await?.value;
        assert_eq!(response, expected);
    }

    {
        let expected: Vec<(u64, u32)> = vec![(1111, 2222_u32), (3333, 4444_u32), (5555, 6666_u32)];
        let response = contract_methods.tuple_in_vec().call().await?.value;
        assert_eq!(response, expected);
    }

    {
        let expected: Vec<SizedAsciiString<4>> =
            vec!["hell".try_into()?, "ello".try_into()?, "lloh".try_into()?];
        let response = contract_methods.str_in_vec().call().await?.value;
        assert_eq!(response, expected);
    }
    Ok(())
}

#[tokio::test]
async fn test_bytes_output() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "BytesOutputContract",
            project = "e2e/sway/types/contracts/bytes"
        )),
        Deploy(
            name = "contract_instance",
            contract = "BytesOutputContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();
    let response = contract_methods.return_bytes(10).call().await?;

    assert_eq!(response.value, (0..10).collect::<Vec<_>>());

    Ok(())
}

#[tokio::test]
async fn test_bytes_as_input() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "BytesInputContract",
            project = "e2e/sway/types/contracts/bytes"
        )),
        Deploy(
            name = "contract_instance",
            contract = "BytesInputContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        // ANCHOR: bytes_arg
        let bytes = Bytes(vec![40, 41, 42]);

        contract_methods.accept_bytes(bytes).call().await?;
        // ANCHOR_END: bytes_arg
    }
    {
        let bytes = Bytes(vec![40, 41, 42]);
        let wrapper = Wrapper {
            inner: vec![bytes.clone(), bytes.clone()],
            inner_enum: SomeEnum::Second(bytes),
        };

        contract_methods.accept_nested_bytes(wrapper).call().await?;
    }

    Ok(())
}

#[tokio::test]
async fn contract_raw_slice() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "RawSliceContract",
            project = "e2e/sway/types/contracts/raw_slice"
        )),
        Deploy(
            name = "contract_instance",
            contract = "RawSliceContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    {
        for length in 0u8..=10 {
            let response = contract_methods.return_raw_slice(length).call().await?;
            assert_eq!(response.value, (0u8..length).collect::<Vec<u8>>());
        }
    }
    {
        contract_methods
            .accept_raw_slice(RawSlice(vec![40, 41, 42]))
            .call()
            .await?;
    }
    {
        let raw_slice = RawSlice(vec![40, 41, 42]);
        let wrapper = Wrapper {
            inner: vec![raw_slice.clone(), raw_slice.clone()],
            inner_enum: SomeEnum::Second(raw_slice),
        };

        contract_methods
            .accept_nested_raw_slice(wrapper)
            .call()
            .await?;
    }

    Ok(())
}

#[tokio::test]
async fn contract_string_slice() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "StringSliceContract",
            project = "e2e/sway/types/contracts/string_slice"
        )),
        Deploy(
            name = "contract_instance",
            contract = "StringSliceContract",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let contract_methods = contract_instance.methods();

    let response = contract_methods
        .handles_str("contract-input".try_into()?)
        .call()
        .await?;
    assert_eq!(response.value, "contract-return");

    Ok(())
}

#[tokio::test]
async fn contract_std_lib_string() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "StdLibString",
            project = "e2e/sway/types/contracts/std_lib_string"
        )),
        Deploy(
            name = "contract_instance",
            contract = "StdLibString",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let resp = contract_methods.return_dynamic_string().call().await?.value;
        assert_eq!(resp, "Hello World");
    }
    {
        let _resp = contract_methods
            .accepts_dynamic_string(String::from("Hello World"))
            .call()
            .await?;
    }
    {
        // confirm encoding/decoding a string wasn't faulty and led to too high gas consumption
        let _resp = contract_methods
            .echoes_dynamic_string(String::from("Hello Fuel"))
            .with_tx_policies(TxPolicies::default().with_script_gas_limit(3600))
            .call()
            .await?;
    }

    Ok(())
}

#[tokio::test]
async fn test_heap_type_in_enums() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "HeapTypeInEnum",
            project = "e2e/sway/types/contracts/heap_type_in_enums"
        )),
        Deploy(
            name = "contract_instance",
            contract = "HeapTypeInEnum",
            wallet = "wallet",
            random_salt = false,
        ),
    );
    let contract_methods = contract_instance.methods();

    {
        let resp = contract_methods.returns_bytes_result(true).call().await?;
        let expected = Ok(Bytes(vec![1, 1, 1, 1]));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_bytes_result(false).call().await?;
        let expected = Err(TestError::Something([255u8, 255u8, 255u8, 255u8, 255u8]));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_vec_result(true).call().await?;
        let expected = Ok(vec![2, 2, 2, 2, 2]);

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_vec_result(false).call().await?;
        let expected = Err(TestError::Else(7777));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_string_result(true).call().await?;
        let expected = Ok("Hello World".to_string());

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_string_result(false).call().await?;
        let expected = Err(TestError::Else(3333));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_str_result(true).call().await?;
        let expected = Ok("Hello World".try_into()?);

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_string_result(false).call().await?;
        let expected = Err(TestError::Else(3333));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_bytes_option(true).call().await?;
        let expected = Some(Bytes(vec![1, 1, 1, 1]));

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_bytes_option(false).call().await?;

        assert!(resp.value.is_none());
    }
    {
        let resp = contract_methods.returns_vec_option(true).call().await?;
        let expected = Some(vec![2, 2, 2, 2, 2]);

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_vec_option(false).call().await?;

        assert!(resp.value.is_none());
    }
    {
        let resp = contract_methods.returns_string_option(true).call().await?;
        let expected = Some("Hello World".to_string());

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_string_option(false).call().await?;

        assert!(resp.value.is_none());
    }
    {
        let resp = contract_methods.returns_str_option(true).call().await?;
        let expected = Some("Hello World".try_into()?);

        assert_eq!(resp.value, expected);
    }
    {
        let resp = contract_methods.returns_string_option(false).call().await?;

        assert!(resp.value.is_none());
    }

    Ok(())
}

#[tokio::test]
async fn nested_heap_types() -> Result<()> {
    setup_program_test!(
        Wallets("wallet"),
        Abigen(Contract(
            name = "HeapTypeInEnum",
            project = "e2e/sway/types/contracts/heap_types"
        )),
        Deploy(
            name = "contract_instance",
            contract = "HeapTypeInEnum",
            wallet = "wallet",
            random_salt = false,
        ),
    );

    let arr = [2u8, 4, 8];
    let struct_generics = StructGenerics {
        one: Bytes(arr.to_vec()),
        two: String::from("fuel"),
        three: RawSlice(arr.to_vec()),
    };

    let enum_vec = [struct_generics.clone(), struct_generics].to_vec();
    let expected = EnumGeneric::One(enum_vec);

    let result = contract_instance
        .methods()
        .nested_heap_types()
        .call()
        .await?;

    assert_eq!(result.value, expected);

    Ok(())
}
```

## Convert to `EvmAddress`

Convert a `Bits256` address to an `EvmAddress`:

```rust,ignore
#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use fuels::{
        prelude::Result,
        types::{Bits256, EvmAddress, Identity},
    };

    #[tokio::test]
    async fn bytes32() -> Result<()> {
        // ANCHOR: bytes32
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
        // ANCHOR_END: bytes32

        // ANCHOR: bytes32_format
        let b256_string = b256.to_string();
        let b256_hex_string = format!("{b256:#x}");
        // ANCHOR_END: bytes32_format

        assert_eq!(hex_str[2..], b256_string);
        assert_eq!(hex_str, b256_hex_string);

        // ANCHOR: bytes32_to_str
        let _str_from_bytes32: &str = b256.to_string().as_str();
        // ANCHOR_END: bytes32_to_str

        Ok(())
    }
    #[tokio::test]
    async fn address() -> Result<()> {
        // ANCHOR: address
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
        // ANCHOR_END: address

        // ANCHOR: address_to_identity
        let _identity_from_address = Identity::Address(address);
        // ANCHOR_END: address_to_identity

        // ANCHOR: address_to_str
        let _str_from_address: &str = address.to_string().as_str();
        // ANCHOR_END: address_to_str

        // ANCHOR: address_to_bits256
        let bits_256 = Bits256(address.into());
        // ANCHOR_END: address_to_bits256

        // ANCHOR: b256_to_evm_address
        let _evm_address = EvmAddress::from(bits_256);
        // ANCHOR_END: b256_to_evm_address

        Ok(())
    }
    #[tokio::test]
    async fn bech32() -> Result<()> {
        // ANCHOR: bech32
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

        // ANCHOR_END: bech32

        Ok(())
    }
    #[tokio::test]
    async fn asset_id() -> Result<()> {
        // ANCHOR: asset_id
        use std::str::FromStr;

        use fuels::types::AssetId;

        // Zeroed Bytes32
        let asset_id = AssetId::zeroed();

        // Grab the inner `[u8; 32]` from
        // `Bytes32` by dereferencing (i.e. `*`) it.
        assert_eq!([0u8; 32], *asset_id);

        // From a `[u8; 32]`.
        // ANCHOR: array_to_asset_id
        let my_slice = [1u8; 32];
        let asset_id = AssetId::new(my_slice);
        // ANCHOR_END: array_to_asset_id
        assert_eq!([1u8; 32], *asset_id);

        // From a string.
        // ANCHOR: string_to_asset_id
        let hex_str = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let asset_id = AssetId::from_str(hex_str)?;
        // ANCHOR_END: string_to_asset_id
        assert_eq!([0u8; 32], *asset_id);
        // ANCHOR_END: asset_id
        Ok(())
    }
    #[tokio::test]
    async fn contract_id() -> Result<()> {
        // ANCHOR: contract_id
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
        // ANCHOR_END: contract_id

        // ANCHOR: contract_id_to_identity
        let _identity_from_contract_id = Identity::ContractId(contract_id);
        // ANCHOR_END: contract_id_to_identity

        // ANCHOR: contract_id_to_str
        let _str_from_contract_id: &str = contract_id.to_string().as_str();
        // ANCHOR_END: contract_id_to_str

        Ok(())
    }

    #[tokio::test]
    async fn type_conversion() -> Result<()> {
        // ANCHOR: type_conversion
        use fuels::types::{AssetId, ContractId};

        let contract_id = ContractId::new([1u8; 32]);

        let asset_id: AssetId = AssetId::new(*contract_id);

        assert_eq!([1u8; 32], *asset_id);
        // ANCHOR_END: type_conversion

        // ANCHOR: asset_id_to_str
        let _str_from_asset_id: &str = asset_id.to_string().as_str();
        // ANCHOR_END: asset_id_to_str

        // ANCHOR: contract_id_to_bits256
        let _contract_id_to_bits_256 = Bits256(contract_id.into());
        // ANCHOR_END: contract_id_to_bits256

        // ANCHOR: asset_id_to_bits256
        let _asset_id_to_bits_256 = Bits256(asset_id.into());
        // ANCHOR_END: asset_id_to_bits256

        Ok(())
    }

    #[tokio::test]
    async fn unused_generics() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/types/contracts/generics/out/release/generics-abi.json"
        ));

        // ANCHOR: unused_generics_struct
        assert_eq!(
            <StructUnusedGeneric<u16, u32>>::new(15),
            StructUnusedGeneric {
                field: 15,
                _unused_generic_0: std::marker::PhantomData,
                _unused_generic_1: std::marker::PhantomData
            }
        );
        // ANCHOR_END: unused_generics_struct

        let my_enum = <EnumUnusedGeneric<u32, u64>>::One(15);
        // ANCHOR: unused_generics_enum
        match my_enum {
            EnumUnusedGeneric::One(_value) => {}
            EnumUnusedGeneric::IgnoreMe(..) => panic!("Will never receive this variant"),
        }
        // ANCHOR_END: unused_generics_enum

        Ok(())
    }
}
```

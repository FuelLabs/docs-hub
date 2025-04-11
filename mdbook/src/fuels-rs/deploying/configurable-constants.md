# Configurable constants

In Sway, you can define `configurable` constants which can be changed during the contract deployment in the SDK. Here is an example how the constants are defined.

```rust,ignore
contract;

#[allow(dead_code)]
enum EnumWithGeneric<D> {
    VariantOne: D,
    VariantTwo: (),
}

struct StructWithGeneric<D> {
    field_1: D,
    field_2: u64,
}

configurable {
    BOOL: bool = true,
    U8: u8 = 8,
    U16: u16 = 16,
    U32: u32 = 32,
    U64: u64 = 63,
    U256: u256 = 0x0000000000000000000000000000000000000000000000000000000000000008u256,
    B256: b256 = 0x0101010101010101010101010101010101010101010101010101010101010101,
    STR_4: str[4] = __to_str_array("fuel"),
    TUPLE: (u8, bool) = (8, true),
    ARRAY: [u32; 3] = [253, 254, 255],
    STRUCT: StructWithGeneric<u8> = StructWithGeneric {
        field_1: 8,
        field_2: 16,
    },
    ENUM: EnumWithGeneric<bool> = EnumWithGeneric::VariantOne(true),
}
//U128: u128 = 128, //TODO: add once https://github.com/FuelLabs/sway/issues/5356 is done

abi TestContract {
    fn return_configurables() -> (bool, u8, u16, u32, u64, u256, b256, str[4], (u8, bool), [u32; 3], StructWithGeneric<u8>, EnumWithGeneric<bool>);
}

impl TestContract for Contract {
    fn return_configurables() -> (bool, u8, u16, u32, u64, u256, b256, str[4], (u8, bool), [u32; 3], StructWithGeneric<u8>, EnumWithGeneric<bool>) {
        (BOOL, U8, U16, U32, U64, U256, B256, STR_4, TUPLE, ARRAY, STRUCT, ENUM)
    }
}
```

Each of the configurable constants will get a dedicated `with` method in the SDK. For example, the constant `STR_4` will get the `with_STR_4` method which accepts the same type as defined in the contract code. Below is an example where we chain several `with` methods and deploy the contract with the new constants.

```rust,ignore
abigen!(Contract(
        name = "MyContract",
        abi = "e2e/sway/contracts/configurables/out/release/configurables-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;

    let str_4: SizedAsciiString<4> = "FUEL".try_into()?;
    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyContractConfigurables::default()
        .with_BOOL(false)?
        .with_U8(7)?
        .with_U16(15)?
        .with_U32(31)?
        .with_U64(63)?
        .with_U256(U256::from(8))?
        .with_B256(Bits256([2; 32]))?
        .with_STR_4(str_4.clone())?
        .with_TUPLE((7, false))?
        .with_ARRAY([252, 253, 254])?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let contract_id = Contract::load_from(
        "sway/contracts/configurables/out/release/configurables.bin",
        LoadConfiguration::default().with_configurables(configurables),
    )?
    .deploy_if_not_exists(&wallet, TxPolicies::default())
    .await?;

    let contract_instance = MyContract::new(contract_id, wallet.clone());
```

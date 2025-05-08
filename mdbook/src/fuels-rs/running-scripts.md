# Running scripts

You can run a script using its JSON-ABI and the path to its binary file. You can run the scripts with arguments. For this, you have to use the `abigen!` macro seen [previously](./abigen/the-abigen-macro.md).

```rust,ignore
// The abigen is used for the same purpose as with contracts (Rust bindings)
    abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/arguments/out/release/arguments-abi.json"
    ));
    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/arguments/out/release/arguments.bin";
    let script_instance = MyScript::new(wallet, bin_path);

    let bim = Bimbam { val: 90 };
    let bam = SugarySnack {
        twix: 100,
        mars: 1000,
    };

    let result = script_instance.main(bim, bam).call().await?;

    let expected = Bimbam { val: 2190 };
    assert_eq!(result.value, expected);
```

Furthermore, if you need to separate submission from value retrieval for any reason, you can do so as follows:

```rust,ignore
let submitted_tx = script_instance.main(my_struct).submit().await?;
    tokio::time::sleep(Duration::from_millis(500)).await;
    let value = submitted_tx.response().await?.value;
```

## Running scripts with transaction policies

The method for passing transaction policies is the same as [with contracts](./calling-contracts/tx-policies.md). As a reminder, the workflow would look like this:

```rust,ignore
let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
    let result = script_instance
        .main(a, b)
        .with_tx_policies(tx_policies)
        .call()
        .await?;
```

## Logs

Script calls provide the same logging functions, `decode_logs()` and `decode_logs_with_type<T>()`, as contract calls. As a reminder, the workflow looks like this:

```rust,ignore
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
```

## Calling contracts from scripts

Scripts use the same interfaces for setting external contracts as [contract methods](./calling-contracts/other-contracts.md).

Below is an example that uses `with_contracts(&[&contract_instance, ...])`.

```rust,ignore
let response = script_instance
        .main(contract_id)
        .with_contracts(&[&contract_instance])
        .call()
        .await?;
```

And this is an example that uses `with_contract_ids(&[&contract_id, ...])`.

```rust,ignore
let response = script_instance
        .main(contract_id)
        .with_contract_ids(&[contract_id.into()])
        .call()
        .await?;
```

## Configurable constants

Same as contracts, you can define `configurable` constants in `scripts` which can be changed during the script execution. Here is an example how the constants are defined.

```rust,ignore
script;

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

fn main() -> (bool, u8, u16, u32, u64, u256, b256, str[4], (u8, bool), [u32; 3], StructWithGeneric<u8>, EnumWithGeneric<bool>) {
    (BOOL, U8, U16, U32, U64, U256, B256, STR_4, TUPLE, ARRAY, STRUCT, ENUM)
}
```

Each configurable constant will get a dedicated `with` method in the SDK. For example, the constant `STR_4` will get the `with_STR_4` method which accepts the same type defined in sway. Below is an example where we chain several `with` methods and execute the script with the new constants.

```rust,ignore
abigen!(Script(
        name = "MyScript",
        abi = "e2e/sway/scripts/script_configurables/out/release/script_configurables-abi.json"
    ));

    let wallet = launch_provider_and_get_wallet().await?;
    let bin_path = "sway/scripts/script_configurables/out/release/script_configurables.bin";
    let instance = MyScript::new(wallet, bin_path);

    let str_4: SizedAsciiString<4> = "FUEL".try_into()?;
    let new_struct = StructWithGeneric {
        field_1: 16u8,
        field_2: 32,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyScriptConfigurables::new(EncoderConfig {
        max_tokens: 5,
        ..Default::default()
    })
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

    let response = instance
        .with_configurables(configurables)
        .main()
        .call()
        .await?;
```

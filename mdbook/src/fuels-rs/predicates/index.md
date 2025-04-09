# Predicates

Predicates, in Sway, are programs that return a Boolean value and do not have any side effects (they are pure). A predicate address can own assets. The predicate address is generated from the compiled byte code and is the same as the `P2SH` address used in Bitcoin. Users can seamlessly send assets to the predicate address as they do for any other address. To spend the predicate funds, the user has to provide the original `byte code` of the predicate together with the `predicate data`. The `predicate data` will be used when executing the `byte code`, and the funds can be transferred if the predicate is validated successfully.

## Instantiating predicates

Let's consider the following predicate example:

```rust,ignore
predicate;

fn main(a: u32, b: u64) -> bool {
    b == a.as_u64()
}
```

We will look at a complete example of using the SDK to send and receive funds from a predicate.

First, we set up the wallets and a node instance. The call to the `abigen!` macro will generate all the types specified in the predicate plus two custom structs:

- an encoder with an `encode_data`  function that will conveniently encode all the arguments of the main function for us.
- a configurables struct which holds methods for setting all the configurables mentioned in the predicate

> Note: The `abigen!` macro will append `Encoder` and `Configurables` to the predicate's `name` field. Fox example, `name="MyPredicate"` will result in two structs called `MyPredicateEncoder` and `MyPredicateConfigurables`.

```rust,ignore
let asset_id = AssetId::zeroed();
        let wallets_config = WalletsConfig::new_multiple_assets(
            2,
            vec![AssetConfig {
                id: asset_id,
                num_coins: 1,
                coin_amount: 1_000,
            }],
        );

        let wallets = &launch_custom_provider_and_get_wallets(wallets_config, None, None).await?;

        let first_wallet = &wallets[0];
        let second_wallet = &wallets[1];

        abigen!(Predicate(
            name = "MyPredicate",
            abi = "e2e/sway/predicates/basic_predicate/out/release/basic_predicate-abi.json"
        ));
```

Once we've compiled our predicate with `forc build`, we can create a `Predicate` instance via `Predicate::load_from`. The resulting data from `encode_data` can then be set on the loaded predicate.

```rust,ignore
let predicate_data = MyPredicateEncoder::default().encode_data(4096, 4096)?;
        let code_path = "../../e2e/sway/predicates/basic_predicate/out/release/basic_predicate.bin";

        let predicate: Predicate = Predicate::load_from(code_path)?
            .with_provider(first_wallet.try_provider()?.clone())
            .with_data(predicate_data);
```

Next, we lock some assets in this predicate using the first wallet:

```rust,ignore
// First wallet transfers amount to predicate.
        first_wallet
            .transfer(predicate.address(), 500, asset_id, TxPolicies::default())
            .await?;

        // Check predicate balance.
        let balance = predicate.get_asset_balance(&AssetId::zeroed()).await?;

        assert_eq!(balance, 500);
```

Then we can transfer assets owned by the predicate via the [Account](../accounts.md) trait:

```rust,ignore
let amount_to_unlock = 300;

        predicate
            .transfer(
                second_wallet.address(),
                amount_to_unlock,
                asset_id,
                TxPolicies::default(),
            )
            .await?;

        // Second wallet balance is updated.
        let balance = second_wallet.get_asset_balance(&AssetId::zeroed()).await?;
        assert_eq!(balance, 1300);
```

## Configurable constants

Same as contracts and scripts, you can define configurable constants in `predicates`, which can be changed during the predicate execution. Here is an example of how the constants are defined.

```rust,ignore
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
    TUPLE: (u8, bool) = (8, true),
    ARRAY: [u32; 3] = [253, 254, 255],
    STRUCT: StructWithGeneric<u8> = StructWithGeneric {
        field_1: 8,
        field_2: 16,
    },
    ENUM: EnumWithGeneric<bool> = EnumWithGeneric::VariantOne(true),
}

fn main(
    switch: bool,
    u_8: u8,
    some_tuple: (u8, bool),
    some_array: [u32; 3],
    some_struct: StructWithGeneric<u8>,
    some_enum: EnumWithGeneric<bool>,
) -> bool {
    switch == BOOL && u_8 == U8 && some_tuple.0 == TUPLE.0 && some_tuple.1 == TUPLE.1 && some_array[0] == ARRAY[0] && some_array[1] == ARRAY[1] && some_array[2] == ARRAY[2] && some_struct == STRUCT && some_enum == ENUM
}
```

Each configurable constant will get a dedicated `with` method in the SDK. For example, the constant `U8` will get the `with_U8` method which accepts the same type defined in sway. Below is an example where we chain several `with` methods and update the predicate with the new constants.

```rust,ignore
abigen!(Predicate(
        name = "MyPredicate",
        abi = "e2e/sway/predicates/predicate_configurables/out/release/predicate_configurables-abi.json"
    ));

    let new_tuple = (16, false);
    let new_array = [123, 124, 125];
    let new_struct = StructWithGeneric {
        field_1: 32u8,
        field_2: 64,
    };
    let new_enum = EnumWithGeneric::VariantTwo;

    let configurables = MyPredicateConfigurables::default()
        .with_U8(8)?
        .with_TUPLE(new_tuple)?
        .with_ARRAY(new_array)?
        .with_STRUCT(new_struct.clone())?
        .with_ENUM(new_enum.clone())?;

    let predicate_data = MyPredicateEncoder::default()
        .encode_data(true, 8u8, new_tuple, new_array, new_struct, new_enum)?;

    let mut predicate: Predicate = Predicate::load_from(
        "sway/predicates/predicate_configurables/out/release/predicate_configurables.bin",
    )?
    .with_data(predicate_data)
    .with_configurables(configurables);
```

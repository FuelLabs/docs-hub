# Transaction Builders

The Rust SDK simplifies the creation of **Create** and **Script** transactions through two handy builder structs `CreateTransactionBuilder`, `ScriptTransactionBuilder`, and the `TransactionBuilder` trait.

Calling `build(&provider)` on a builder will result in the corresponding `CreateTransaction` or `ScriptTransaction` that can be submitted to the network.

## Role of the transaction builders

> **Note** This section contains additional information about the inner workings of the builders. If you are just interested in how to use them, you can skip to the next section.

The builders take on the heavy lifting behind the scenes, offering two standout advantages: handling predicate data offsets and managing witness indexing.

When your transaction involves predicates with dynamic data as inputs, like vectors, the dynamic data contains a pointer pointing to the beginning of the raw data. This pointer's validity hinges on the order of transaction inputs, and any shifting could render it invalid. However, the transaction builders conveniently postpone the resolution of these pointers until you finalize the build process.

Similarly, adding signatures for signed coins requires the signed coin input to hold an index corresponding to the signature in the witnesses array. These indexes can also become invalid if the witness order changes. The Rust SDK again defers the resolution of these indexes until the transaction is finalized. It handles the assignment of correct index witnesses behind the scenes, sparing you the hassle of dealing with indexing intricacies during input definition.

Another added benefit of the builder pattern is that it guards against changes once the transaction is finalized. The transactions resulting from a builder don't permit any changes to the struct that could cause the transaction ID to be modified. This eliminates the headache of calculating and storing a transaction ID for future use, only to accidentally modify the transaction later, resulting in a different transaction ID.

## Creating a custom transaction

Here is an example outlining some of the features of the transaction builders.

In this scenario, we have a predicate that holds some bridged asset with ID **bridged_asset_id**. It releases it's locked assets if the transaction sends **ask_amount** of the base asset to the **receiver** address:

```rust,ignore
let ask_amount = 100;
        let locked_amount = 500;
        let bridged_asset_id = AssetId::from([1u8; 32]);
        let receiver = Bech32Address::from_str(
            "fuel1p8qt95dysmzrn2rmewntg6n6rg3l8ztueqafg5s6jmd9cgautrdslwdqdw",
        )?;
```

Our goal is to create a transaction that will use our hot wallet to transfer the **ask_amount** to the **receiver** and then send the unlocked predicate assets to a second wallet that acts as our cold storage.

Let's start by instantiating a builder. Since we don't plan to deploy a contract, the `ScriptTransactionBuilder` is the appropriate choice:

```rust,ignore
let tb = ScriptTransactionBuilder::default();
```

Next, we need to define transaction inputs of the base asset that sum up to **ask_amount**. We also need transaction outputs that will assign those assets to the predicate address and thereby unlock it. The methods `get_asset_inputs_for_amount` and `get_asset_outputs_for_amount` can help with that. We need to specify the asset ID, the target amount, and the target address:

```rust,ignore
let consensus_parameters = provider.consensus_parameters().await?;
        let base_inputs = hot_wallet
            .get_asset_inputs_for_amount(*consensus_parameters.base_asset_id(), ask_amount, None)
            .await?;
        let base_outputs = hot_wallet.get_asset_outputs_for_amount(
            &receiver,
            *consensus_parameters.base_asset_id(),
            ask_amount,
        );
```

Let's repeat the same process but this time for transferring the assets held by the predicate to our cold storage:

```rust,ignore
let other_asset_inputs = predicate
            .get_asset_inputs_for_amount(bridged_asset_id, locked_amount, None)
            .await?;
        let other_asset_outputs =
            predicate.get_asset_outputs_for_amount(cold_wallet.address(), bridged_asset_id, 500);
```

We combine all of the inputs and outputs and set them on the builder:

```rust,ignore
let inputs = base_inputs
            .into_iter()
            .chain(other_asset_inputs.into_iter())
            .collect();
        let outputs = base_outputs
            .into_iter()
            .chain(other_asset_outputs.into_iter())
            .collect();

        let mut tb = tb.with_inputs(inputs).with_outputs(outputs);
```

As we have used coins that require a signature, we have to add the signer to the transaction builder with:

```rust,ignore
tb.add_signer(hot_wallet.clone())?;
```

> **Note** The signature is not created until the transaction is finalized with `build(&provider)`

We need to do one more thing before we stop thinking about transaction inputs. Executing the transaction also incurs a fee that is paid with the base asset. Our base asset inputs need to be large enough so that the total amount covers the transaction fee and any other operations we are doing. The `ViewOnlyAccount` trait lets us use `adjust_for_fee()` for adjusting the transaction inputs if needed to cover the fee. The second argument to `adjust_for_fee()` is the total amount of the base asset that we expect our transaction to spend regardless of fees. In our case, this is the **ask_amount** we are transferring to the predicate.

```rust,ignore
hot_wallet.adjust_for_fee(&mut tb, 100).await?;
```

> **Note** It is recommended to add signers before calling `adjust_for_fee()` as the estimation will include the size of the witnesses.

We can also define transaction policies. For example, we can limit the gas price by doing the following:

```rust,ignore
let tx_policies = TxPolicies::default().with_tip(1);
        let tb = tb.with_tx_policies(tx_policies);
```

Our builder needs a signature from the hot wallet to unlock its coins before we call `build()` and submit the resulting transaction through the provider:

```rust,ignore
let tx = tb.build(&provider).await?;
        let tx_id = provider.send_transaction(tx).await?;
```

Finally, we verify the transaction succeeded and that the cold storage indeed holds the bridged asset now:

```rust,ignore
let status = provider.tx_status(&tx_id).await?;
        assert!(matches!(status, TxStatus::Success { .. }));

        let balance = cold_wallet.get_asset_balance(&bridged_asset_id).await?;
        assert_eq!(balance, locked_amount);
```

## Building a transaction without signatures

If you need to build the transaction without signatures, which is useful when estimating transaction costs or simulations, you can change the build strategy used:

```rust,ignore
let mut tx = tb
        .with_build_strategy(ScriptBuildStrategy::NoSignatures)
        .build(provider)
        .await?;
    // ANCHOR: tx_sign_with
    tx.sign_with(&wallet, consensus_parameters.chain_id())
        .await?;
    // ANCHOR_END: tx_sign_with
```

> **Note** In contrast to adding signers to a transaction builder, when signing a built transaction, you must ensure that the order of signatures matches the order of signed inputs. Multiple signed inputs with the same owner will have the same witness index.

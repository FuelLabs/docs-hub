# Transfer all assets

The `transfer()` method lets you transfer a single asset, but what if you needed to move all of your assets to a different wallet? You could repeatably call `transfer()`, initiating a transaction each time, or you bundle all the transfers into a single transaction. This chapter guides you through crafting your custom transaction for transferring all assets owned by a wallet.

Lets quickly go over the setup:

```rust,ignore
let mut wallet_1 = WalletUnlocked::new_random(None);
        let mut wallet_2 = WalletUnlocked::new_random(None);

        const NUM_ASSETS: u64 = 5;
        const AMOUNT: u64 = 100_000;
        const NUM_COINS: u64 = 1;
        let (coins, _) =
            setup_multiple_assets_coins(wallet_1.address(), NUM_ASSETS, NUM_COINS, AMOUNT);

        let provider = setup_test_provider(coins, vec![], None, None).await?;

        wallet_1.set_provider(provider.clone());
        wallet_2.set_provider(provider.clone());
```

We prepare two wallets with randomized addresses. Next, we want one of our wallets to have some random assets, so we set them up with `setup_multiple_assets_coins()`. Having created the coins, we can start a provider and assign it to the previously created wallets.

Transactions require us to define input and output coins. Let's assume we do not know the assets owned by `wallet_1`. We retrieve its balances, i.e. tuples consisting of a string representing the asset ID and the respective amount. This lets us use the helpers `get_asset_inputs_for_amount()`, `get_asset_outputs_for_amount()` to create the appropriate inputs and outputs.

We transfer only a part of the base asset balance so that the rest can cover transaction fees:

```rust,ignore
let balances = wallet_1.get_balances().await?;

        let consensus_parameters = provider.consensus_parameters().await?;
        let mut inputs = vec![];
        let mut outputs = vec![];
        for (id_string, amount) in balances {
            let id = AssetId::from_str(&id_string)?;
            let amount = amount as u64;

            let input = wallet_1
                .get_asset_inputs_for_amount(id, amount, None)
                .await?;
            inputs.extend(input);

            // we don't transfer the full base asset so we can cover fees
            let output = if id == *consensus_parameters.base_asset_id() {
                wallet_1.get_asset_outputs_for_amount(wallet_2.address(), id, amount / 2)
            } else {
                wallet_1.get_asset_outputs_for_amount(wallet_2.address(), id, amount)
            };

            outputs.extend(output);
        }
```

All that is left is to build the transaction via `ScriptTransactionBuilder`, have `wallet_1` sign it, and we can send it. We confirm this by checking the number of balances present in the receiving wallet and their amount:

```rust,ignore
let mut tb =
            ScriptTransactionBuilder::prepare_transfer(inputs, outputs, TxPolicies::default());
        tb.add_signer(wallet_1.clone())?;

        let tx = tb.build(&provider).await?;

        provider.send_transaction_and_await_commit(tx).await?;

        let balances = wallet_2.get_balances().await?;

        assert_eq!(balances.len(), NUM_ASSETS as usize);
        for (id, balance) in balances {
            if id == *consensus_parameters.base_asset_id().to_string() {
                assert_eq!(balance, (AMOUNT / 2) as u128);
            } else {
                assert_eq!(balance, AMOUNT as u128);
            }
        }
```

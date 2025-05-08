# Accounts

The `ViewOnlyAccount` trait provides a common interface to query balances.

The `Account` trait, in addition to the above, also provides a common interface to retrieve spendable resources or transfer assets. When performing actions in the SDK that lead to a transaction, you will typically need to provide an account that will be used to allocate resources required by the transaction, including transaction fees.

The traits are implemented by the following types:

- [`Wallet`](./wallets/index.md)
- [`Predicate`](./predicates/index.md)
- [`ImpersonatedAccount`](#account-impersonation)

## Transferring assets

An account implements the following methods for transferring assets:

- `transfer`
- `force_transfer_to_contract`
- `withdraw_to_base_layer`

The following examples are provided for a `Wallet` account. A `Predicate` account would work similarly, but you might need to set its predicate data before attempting to spend resources owned by it.

With `wallet.transfer` you can initiate a transaction to transfer an asset from your account to a target address.

```rust,ignore
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
```

You can transfer assets to a contract via `wallet.force_transfer_to_contract`.

```rust,ignore
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
```

For transferring assets to the base layer chain, you can use `wallet.withdraw_to_base_layer`.

```rust,ignore
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
```

The above example creates an `Address` from a string and converts it to a `Bech32Address`. Next, it calls `wallet.withdraw_to_base_layer` by providing the address, the amount to be transferred, and the transaction policies. Lastly, to verify that the transfer succeeded, the relevant message proof is retrieved with `provider.get_message_proof,` and the amount and the recipient are verified.

## Account impersonation

To facilitate account impersonation, the Rust SDK provides the `ImpersonatedAccount` struct. Since it implements `Account`, we can use it to simulate ownership of assets held by an account with a given address. This also implies that we can impersonate contract calls from that address. `ImpersonatedAccount` will only succeed in unlocking assets if the network is set up with `utxo_validation = false`.

```rust,ignore
// create impersonator for an address
        let address =
            Address::from_str("0x17f46f562778f4bb5fe368eeae4985197db51d80c83494ea7f84c530172dedd1")
                .unwrap();
        let address = Bech32Address::from(address);
        let impersonator = ImpersonatedAccount::new(address, Some(provider.clone()));

        let contract_instance = MyContract::new(contract_id, impersonator.clone());

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
```

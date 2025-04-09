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
```rust\n#[cfg(test)]
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
}\n```
```

You can transfer assets to a contract via `wallet.force_transfer_to_contract`.

```rust,ignore
```rust\n#[cfg(test)]
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
}\n```
```

For transferring assets to the base layer chain, you can use `wallet.withdraw_to_base_layer`.

```rust,ignore
```rust\n#[cfg(test)]
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
}\n```
```

The above example creates an `Address` from a string and converts it to a `Bech32Address`. Next, it calls `wallet.withdraw_to_base_layer` by providing the address, the amount to be transferred, and the transaction policies. Lastly, to verify that the transfer succeeded, the relevant message proof is retrieved with `provider.get_message_proof,` and the amount and the recipient are verified.

## Account impersonation

To facilitate account impersonation, the Rust SDK provides the `ImpersonatedAccount` struct. Since it implements `Account`, we can use it to simulate ownership of assets held by an account with a given address. This also implies that we can impersonate contract calls from that address. `ImpersonatedAccount` will only succeed in unlocking assets if the network is set up with `utxo_validation = false`.

```rust,ignore
```rust\n#[cfg(test)]
mod tests {
    use std::{collections::HashSet, time::Duration};

    use fuels::{
        core::codec::{encode_fn_selector, ABIFormatter, DecoderConfig, EncoderConfig},
        crypto::SecretKey,
        prelude::{LoadConfiguration, NodeConfig, StorageConfiguration},
        programs::debug::ScriptType,
        test_helpers::{ChainConfig, StateConfig},
        types::{
            errors::{transaction::Reason, Result},
            Bits256,
        },
    };
    use rand::Rng;

    #[tokio::test]
    async fn instantiate_client() -> Result<()> {
        // ANCHOR: instantiate_client
        use fuels::prelude::{FuelService, Provider};

        // Run the fuel node.
        let server = FuelService::start(
            NodeConfig::default(),
            ChainConfig::default(),
            StateConfig::default(),
        )
        .await?;

        // Create a client that will talk to the node created above.
        let client = Provider::from(server.bound_address()).await?;
        assert!(client.healthy().await?);
        // ANCHOR_END: instantiate_client
        Ok(())
    }

    #[tokio::test]
    async fn deploy_contract() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract
        // This helper will launch a local node and provide a test wallet linked to it
        let wallet = launch_provider_and_get_wallet().await?;

        // This will load and deploy your contract binary to the chain so that its ID can
        // be used to initialize the instance
        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR_END: deploy_contract

        Ok(())
    }

    #[tokio::test]
    async fn setup_program_test_example() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deploy_contract_setup_macro_short
        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );

        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);
        // ANCHOR_END: deploy_contract_setup_macro_short

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_cost_estimation
        let contract_instance = MyContract::new(contract_id, wallet);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: contract_call_cost_estimation

        let expected_gas = 2816;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_parameters() -> std::result::Result<(), Box<dyn std::error::Error>> {
        use fuels::{prelude::*, tx::StorageSlot, types::Bytes32};
        use rand::prelude::{Rng, SeedableRng, StdRng};

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");

        // ANCHOR: deploy_with_parameters
        // Optional: Add `Salt`
        let rng = &mut StdRng::seed_from_u64(2322u64);
        let salt: [u8; 32] = rng.gen();

        // Optional: Configure storage
        let key = Bytes32::from([1u8; 32]);
        let value = Bytes32::from([2u8; 32]);
        let storage_slot = StorageSlot::new(key, value);
        let storage_configuration =
            StorageConfiguration::default().add_slot_overrides([storage_slot]);
        let configuration = LoadConfiguration::default()
            .with_storage_configuration(storage_configuration)
            .with_salt(salt);

        // Optional: Configure deployment parameters
        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            configuration,
        )?
        .deploy(&wallet, tx_policies)
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        // ANCHOR_END: deploy_with_parameters

        assert_ne!(contract_id_1, contract_id_2);

        // ANCHOR: use_deployed_contract
        // This will generate your contract's methods onto `MyContract`.
        // This means an instance of `MyContract` will have access to all
        // your contract's methods that are running on-chain!
        // ANCHOR: abigen_example
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        // ANCHOR_END: abigen_example

        // This is an instance of your contract which you can use to make calls to your functions
        let contract_instance = MyContract::new(contract_id_2, wallet);

        let response = contract_instance
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call() // Perform the network call
            .await?;

        assert_eq!(42, response.value);

        let response = contract_instance
            .methods()
            .increment_counter(10)
            .call()
            .await?;

        assert_eq!(52, response.value);
        // ANCHOR_END: use_deployed_contract

        // ANCHOR: submit_response_contract
        let response = contract_instance
            .methods()
            .initialize_counter(42)
            .submit()
            .await?;

        tokio::time::sleep(Duration::from_millis(500)).await;
        let value = response.response().await?.value;

        // ANCHOR_END: submit_response_contract
        assert_eq!(42, value);

        Ok(())
    }

    #[tokio::test]
    async fn deploy_with_multiple_wallets() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallets =
            launch_custom_provider_and_get_wallets(WalletsConfig::default(), None, None).await?;

        let contract_id_1 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallets[0], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_1}");
        let contract_instance_1 = MyContract::new(contract_id_1, wallets[0].clone());

        let response = contract_instance_1
            .methods()
            .initialize_counter(42)
            .call()
            .await?;

        assert_eq!(42, response.value);

        let contract_id_2 = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default().with_salt([1; 32]),
        )?
        .deploy(&wallets[1], TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id_2}");
        let contract_instance_2 = MyContract::new(contract_id_2, wallets[1].clone());

        let response = contract_instance_2
            .methods()
            .initialize_counter(42) // Build the ABI call
            .call()
            .await?;

        assert_eq!(42, response.value);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn contract_tx_and_call_params() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        // ANCHOR: tx_policies
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();

        let tx_policies = TxPolicies::default()
            .with_tip(1)
            .with_script_gas_limit(1_000_000)
            .with_maturity(0);

        let response = contract_methods
            .initialize_counter(42) // Our contract method
            .with_tx_policies(tx_policies) // Chain the tx policies
            .call() // Perform the contract call
            .await?; // This is an async call, `.await` it.
                     // ANCHOR_END: tx_policies

        // ANCHOR: tx_policies_default
        let response = contract_methods
            .initialize_counter(42)
            .with_tx_policies(TxPolicies::default())
            .call()
            .await?;
        // ANCHOR_END: tx_policies_default

        // ANCHOR: call_parameters
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let tx_policies = TxPolicies::default();

        // Forward 1_000_000 coin amount of base asset_id
        // this is a big number for checking that amount can be a u64
        let call_params = CallParameters::default().with_amount(1_000_000);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_parameters

        // ANCHOR: call_parameters_default
        let response = contract_methods
            .initialize_counter(42)
            .call_params(CallParameters::default())?
            .call()
            .await?;
        // ANCHOR_END: call_parameters_default
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn token_ops_tests() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/token_ops/out/release/token_ops-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/token_ops/out/release/token_ops\
        .bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        println!("Contract deployed @ {contract_id}");
        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();
        // ANCHOR: simulate
        // you would mint 100 coins if the transaction wasn't simulated
        let counter = contract_methods
            .mint_coins(100)
            .simulate(Execution::Realistic)
            .await?;
        // ANCHOR_END: simulate

        {
            let contract_id = contract_id.clone();
            // ANCHOR: simulate_read_state
            // you don't need any funds to read state
            let balance = contract_methods
                .get_balance(contract_id, AssetId::zeroed())
                .simulate(Execution::StateReadOnly)
                .await?
                .value;
            // ANCHOR_END: simulate_read_state
        }

        let response = contract_methods.mint_coins(1_000_000).call().await?;
        // ANCHOR: variable_outputs
        let address = wallet.address();
        let asset_id = contract_id.asset_id(&Bits256::zeroed());

        // withdraw some tokens to wallet
        let response = contract_methods
            .transfer(1_000_000, asset_id, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;
        // ANCHOR_END: variable_outputs
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn dependency_estimation() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let called_contract_id: ContractId = Contract::load_from(
            "../../e2e/sway/contracts/lib_contract/out/release/lib_contract.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?
        .into();

        let bin_path =
            "../../e2e/sway/contracts/lib_contract_caller/out/release/lib_contract_caller.bin";
        let caller_contract_id = Contract::load_from(bin_path, LoadConfiguration::default())?
            .deploy(&wallet, TxPolicies::default())
            .await?;

        let contract_methods =
            MyContract::new(caller_contract_id.clone(), wallet.clone()).methods();

        // ANCHOR: dependency_estimation_fail
        let address = wallet.address();
        let amount = 100;

        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .call()
            .await;

        assert!(matches!(
            response,
            Err(Error::Transaction(Reason::Reverted { .. }))
        ));
        // ANCHOR_END: dependency_estimation_fail

        // ANCHOR: dependency_estimation_manual
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .with_contract_ids(&[called_contract_id.into()])
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation_manual

        let asset_id = caller_contract_id.asset_id(&Bits256::zeroed());
        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, amount);

        // ANCHOR: dependency_estimation
        let response = contract_methods
            .mint_then_increment_from_contract(called_contract_id, amount, address.into())
            .with_variable_output_policy(VariableOutputPolicy::EstimateMinimum)
            .determine_missing_contracts(Some(2))
            .await?
            .call()
            .await?;
        // ANCHOR_END: dependency_estimation

        let balance = wallet.get_asset_balance(&asset_id).await?;
        assert_eq!(balance, 2 * amount);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn get_contract_outputs() -> Result<()> {
        use fuels::prelude::*;

        // ANCHOR: deployed_contracts
        abigen!(Contract(
            name = "MyContract",
            // Replace with your contract ABI.json path
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));
        let wallet_original = launch_provider_and_get_wallet().await?;

        let wallet = wallet_original.clone();
        // Your bech32m encoded contract ID.
        let contract_id: Bech32ContractId =
            "fuel1vkm285ypjesypw7vhdlhnty3kjxxx4efckdycqh3ttna4xvmxtfs6murwy".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // You can now use the `connected_contract_instance` just as you did above!
        // ANCHOR_END: deployed_contracts

        let wallet = wallet_original;
        // ANCHOR: deployed_contracts_hex
        let contract_id: ContractId =
            "0x65b6a3d081966040bbccbb7f79ac91b48c635729c59a4c02f15ae7da999b32d3".parse()?;

        let connected_contract_instance = MyContract::new(contract_id, wallet);
        // ANCHOR_END: deployed_contracts_hex

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn call_params_gas() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: call_params_gas
        // Set the transaction `gas_limit` to 1_000_000 and `gas_forwarded` to 4300 to specify that
        // the contract call transaction may consume up to 1_000_000 gas, while the actual call may
        // only use 4300 gas
        let tx_policies = TxPolicies::default().with_script_gas_limit(1_000_000);
        let call_params = CallParameters::default().with_gas_forwarded(4300);

        let response = contract_methods
            .get_msg_amount() // Our contract method.
            .with_tx_policies(tx_policies) // Chain the tx policies.
            .call_params(call_params)? // Chain the call parameters.
            .call() // Perform the contract call.
            .await?;
        // ANCHOR_END: call_params_gas
        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_example() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: multi_call_prepare
        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);
        // ANCHOR_END: multi_call_prepare

        // ANCHOR: multi_call_build
        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);
        // ANCHOR_END: multi_call_build
        let multi_call_handler_tmp = multi_call_handler.clone();

        // ANCHOR: multi_call_values
        let (counter, array): (u64, [u64; 2]) = multi_call_handler.call().await?.value;
        // ANCHOR_END: multi_call_values

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: multi_contract_call_response
        let response = multi_call_handler.call::<(u64, [u64; 2])>().await?;
        // ANCHOR_END: multi_contract_call_response

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        let multi_call_handler = multi_call_handler_tmp.clone();
        // ANCHOR: submit_response_multicontract
        let submitted_tx = multi_call_handler.submit().await?;
        tokio::time::sleep(Duration::from_millis(500)).await;
        let (counter, array): (u64, [u64; 2]) = submitted_tx.response().await?.value;
        // ANCHOR_END: submit_response_multicontract

        assert_eq!(counter, 42);
        assert_eq!(array, [42; 2]);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn multi_call_cost_estimation() -> Result<()> {
        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let wallet = launch_provider_and_get_wallet().await?;

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id, wallet.clone()).methods();

        // ANCHOR: multi_call_cost_estimation
        let call_handler_1 = contract_methods.initialize_counter(42);
        let call_handler_2 = contract_methods.get_array([42; 2]);

        let multi_call_handler = CallHandler::new_multi_call(wallet.clone())
            .add_call(call_handler_1)
            .add_call(call_handler_2);

        let tolerance = Some(0.0);
        let block_horizon = Some(1);
        let transaction_cost = multi_call_handler
            .estimate_transaction_cost(tolerance, block_horizon) // Get estimated transaction cost
            .await?;
        // ANCHOR_END: multi_call_cost_estimation

        let expected_gas = 4402;

        assert_eq!(transaction_cost.gas_used, expected_gas);

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn connect_wallet() -> Result<()> {
        use fuels::prelude::*;
        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let config = WalletsConfig::new(Some(2), Some(1), Some(DEFAULT_COIN_AMOUNT));
        let mut wallets = launch_custom_provider_and_get_wallets(config, None, None).await?;
        let wallet_1 = wallets.pop().unwrap();
        let wallet_2 = wallets.pop().unwrap();

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet_1, TxPolicies::default())
        .await?;

        // ANCHOR: connect_wallet
        // Create contract instance with wallet_1
        let contract_instance = MyContract::new(contract_id, wallet_1.clone());

        // Perform contract call with wallet_2
        let response = contract_instance
            .with_account(wallet_2) // Connect wallet_2
            .methods() // Get contract methods
            .get_msg_amount() // Our contract method
            .call() // Perform the contract call.
            .await?; // This is an async call, `.await` for it.
                     // ANCHOR_END: connect_wallet

        Ok(())
    }

    #[tokio::test]
    async fn custom_assets_example() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let other_wallet = WalletUnlocked::new_random(None);

        // ANCHOR: add_custom_assets
        let amount = 1000;
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .add_custom_asset(
                AssetId::zeroed(),
                amount,
                Some(other_wallet.address().clone()),
            )
            .call()
            .await?;
        // ANCHOR_END: add_custom_assets

        Ok(())
    }

    #[tokio::test]
    async fn low_level_call_example() -> Result<()> {
        use fuels::{core::codec::calldata, prelude::*, types::SizedAsciiString};

        setup_program_test!(
            Wallets("wallet"),
            Abigen(
                Contract(
                    name = "MyCallerContract",
                    project = "e2e/sway/contracts/low_level_caller"
                ),
                Contract(
                    name = "MyTargetContract",
                    project = "e2e/sway/contracts/contract_test"
                ),
            ),
            Deploy(
                name = "caller_contract_instance",
                contract = "MyCallerContract",
                wallet = "wallet"
            ),
            Deploy(
                name = "target_contract_instance",
                contract = "MyTargetContract",
                wallet = "wallet"
            ),
        );

        // ANCHOR: low_level_call
        let function_selector = encode_fn_selector("set_value_multiple_complex");
        let call_data = calldata!(
            MyStruct {
                a: true,
                b: [1, 2, 3],
            },
            SizedAsciiString::<4>::try_from("fuel")?
        )?;

        caller_contract_instance
            .methods()
            .call_low_level_call(
                target_contract_instance.id(),
                Bytes(function_selector),
                Bytes(call_data),
            )
            .determine_missing_contracts(None)
            .await?
            .call()
            .await?;
        // ANCHOR_END: low_level_call

        let result_uint = target_contract_instance
            .methods()
            .get_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_bool = target_contract_instance
            .methods()
            .get_bool_value()
            .call()
            .await
            .unwrap()
            .value;

        let result_str = target_contract_instance
            .methods()
            .get_str_value()
            .call()
            .await
            .unwrap()
            .value;

        assert_eq!(result_uint, 2);
        assert!(result_bool);
        assert_eq!(result_str, "fuel");

        Ok(())
    }

    #[tokio::test]
    async fn configure_the_return_value_decoder() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_decoder_config
        let _ = contract_instance
            .methods()
            .initialize_counter(42)
            .with_decoder_config(DecoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .call()
            .await?;
        // ANCHOR_END: contract_decoder_config

        Ok(())
    }

    #[tokio::test]
    async fn storage_slots_override() -> Result<()> {
        {
            // ANCHOR: storage_slots_override
            use fuels::{programs::contract::Contract, tx::StorageSlot};
            let slot_override = StorageSlot::new([1; 32].into(), [2; 32].into());
            let storage_config =
                StorageConfiguration::default().add_slot_overrides([slot_override]);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_override
        }

        {
            // ANCHOR: storage_slots_disable_autoload
            use fuels::programs::contract::Contract;
            let storage_config = StorageConfiguration::default().with_autoload(false);

            let load_config =
                LoadConfiguration::default().with_storage_configuration(storage_config);
            let _: Result<_> = Contract::load_from("...", load_config);
            // ANCHOR_END: storage_slots_disable_autoload
        }

        Ok(())
    }

    #[tokio::test]
    async fn contract_custom_call() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "TestContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "TestContract",
                wallet = "wallet"
            ),
        );
        let provider = wallet.try_provider()?;

        let counter = 42;

        // ANCHOR: contract_call_tb
        let call_handler = contract_instance.methods().initialize_counter(counter);

        let mut tb = call_handler.transaction_builder().await?;

        // customize the builder...

        wallet.adjust_for_fee(&mut tb, 0).await?;
        tb.add_signer(wallet.clone())?;

        let tx = tb.build(provider).await?;

        let tx_id = provider.send_transaction(tx).await?;
        tokio::time::sleep(Duration::from_millis(500)).await;

        let tx_status = provider.tx_status(&tx_id).await?;

        let response = call_handler.get_response_from(tx_status)?;

        assert_eq!(counter, response.value);
        // ANCHOR_END: contract_call_tb

        Ok(())
    }

    #[tokio::test]
    async fn configure_encoder_config() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Wallets("wallet"),
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        // ANCHOR: contract_encoder_config
        let _ = contract_instance
            .with_encoder_config(EncoderConfig {
                max_depth: 10,
                max_tokens: 2_000,
            })
            .methods()
            .initialize_counter(42)
            .call()
            .await?;
        // ANCHOR_END: contract_encoder_config

        Ok(())
    }

    #[tokio::test]
    async fn contract_call_impersonation() -> Result<()> {
        use std::str::FromStr;

        use fuels::prelude::*;

        abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/contract_test/out/release/contract_test-abi.json"
        ));

        let node_config = NodeConfig {
            utxo_validation: false,
            ..Default::default()
        };
        let mut wallet = WalletUnlocked::new_from_private_key(
            SecretKey::from_str(
                "0x4433d156e8c53bf5b50af07aa95a29436f29a94e0ccc5d58df8e57bdc8583c32",
            )?,
            None,
        );
        let coins = setup_single_asset_coins(
            wallet.address(),
            AssetId::zeroed(),
            DEFAULT_NUM_COINS,
            DEFAULT_COIN_AMOUNT,
        );
        let provider = setup_test_provider(coins, vec![], Some(node_config), None).await?;
        wallet.set_provider(provider.clone());

        let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test.bin",
            LoadConfiguration::default(),
        )?
        .deploy(&wallet, TxPolicies::default())
        .await?;

        // ANCHOR: contract_call_impersonation
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
        // ANCHOR_END: contract_call_impersonation

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn deploying_via_loader() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/huge_contract"
            )),
            Wallets("main_wallet")
        );
        let contract_binary =
            "../../e2e/sway/contracts/huge_contract/out/release/huge_contract.bin";

        let provider: Provider = main_wallet.try_provider()?.clone();

        let random_salt = || Salt::new(rand::thread_rng().gen());
        // ANCHOR: show_contract_is_too_big
        let contract = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?;
        let max_allowed = provider
            .consensus_parameters()
            .await?
            .contract_params()
            .contract_max_size();

        assert!(contract.code().len() as u64 > max_allowed);
        // ANCHOR_END: show_contract_is_too_big

        let wallet = main_wallet.clone();

        // ANCHOR: manual_blob_upload_then_deploy
        let max_words_per_blob = 10_000;
        let blobs = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .blobs()
        .to_vec();

        let mut all_blob_ids = vec![];
        let mut already_uploaded_blobs = HashSet::new();
        for blob in blobs {
            let blob_id = blob.id();
            all_blob_ids.push(blob_id);

            // uploading the same blob twice is not allowed
            if already_uploaded_blobs.contains(&blob_id) {
                continue;
            }

            let mut tb = BlobTransactionBuilder::default().with_blob(blob);
            wallet.adjust_for_fee(&mut tb, 0).await?;
            wallet.add_witnesses(&mut tb)?;

            let tx = tb.build(&provider).await?;
            provider
                .send_transaction_and_await_commit(tx)
                .await?
                .check(None)?;

            already_uploaded_blobs.insert(blob_id);
        }

        let contract_id = Contract::loader_from_blob_ids(all_blob_ids, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blob_upload_then_deploy

        // ANCHOR: deploy_via_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: deploy_via_loader

        // ANCHOR: auto_convert_to_loader
        let max_words_per_blob = 10_000;
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .smart_deploy(&wallet, TxPolicies::default(), max_words_per_blob)
        .await?;
        // ANCHOR_END: auto_convert_to_loader

        // ANCHOR: upload_blobs_then_deploy
        let contract_id = Contract::load_from(
            contract_binary,
            LoadConfiguration::default().with_salt(random_salt()),
        )?
        .convert_to_loader(max_words_per_blob)?
        .upload_blobs(&wallet, TxPolicies::default())
        .await?
        .deploy(&wallet, TxPolicies::default())
        .await?;
        // ANCHOR_END: upload_blobs_then_deploy

        let wallet = main_wallet.clone();
        // ANCHOR: use_loader
        let contract_instance = MyContract::new(contract_id, wallet);
        let response = contract_instance.methods().something().call().await?.value;
        assert_eq!(response, 1001);
        // ANCHOR_END: use_loader

        // ANCHOR: show_max_tx_size
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_size();
        // ANCHOR_END: show_max_tx_size

        // ANCHOR: show_max_tx_gas
        provider
            .consensus_parameters()
            .await?
            .tx_params()
            .max_gas_per_tx();
        // ANCHOR_END: show_max_tx_gas

        let wallet = main_wallet;
        // ANCHOR: manual_blobs_then_deploy
        let chunk_size = 100_000;
        assert!(
            chunk_size % 8 == 0,
            "all chunks, except the last, must be word-aligned"
        );
        let blobs = contract
            .code()
            .chunks(chunk_size)
            .map(|chunk| Blob::new(chunk.to_vec()))
            .collect();

        let contract_id = Contract::loader_from_blobs(blobs, random_salt(), vec![])?
            .deploy(&wallet, TxPolicies::default())
            .await?;
        // ANCHOR_END: manual_blobs_then_deploy

        // ANCHOR: estimate_max_blob_size
        let max_blob_size = BlobTransactionBuilder::default()
            .estimate_max_blob_size(&provider)
            .await?;
        // ANCHOR_END: estimate_max_blob_size

        Ok(())
    }

    #[tokio::test]
    #[allow(unused_variables)]
    async fn decoding_script_transactions() -> Result<()> {
        use fuels::prelude::*;

        setup_program_test!(
            Abigen(Contract(
                name = "MyContract",
                project = "e2e/sway/contracts/contract_test"
            )),
            Wallets("wallet"),
            Deploy(
                name = "contract_instance",
                contract = "MyContract",
                wallet = "wallet"
            )
        );

        let tx_id = contract_instance
            .methods()
            .initialize_counter(42)
            .call()
            .await?
            .tx_id
            .unwrap();

        let provider: &Provider = wallet.try_provider()?;

        // ANCHOR: decoding_script_transactions
        let TransactionType::Script(tx) = provider
            .get_transaction_by_id(&tx_id)
            .await?
            .unwrap()
            .transaction
        else {
            panic!("Transaction is not a script transaction");
        };

        let ScriptType::ContractCall(calls) = ScriptType::detect(tx.script(), tx.script_data())?
        else {
            panic!("Script is not a contract call");
        };

        let json_abi = std::fs::read_to_string(
            "../../e2e/sway/contracts/contract_test/out/release/contract_test-abi.json",
        )?;
        let abi_formatter = ABIFormatter::from_json_abi(json_abi)?;

        let call = &calls[0];
        let fn_selector = call.decode_fn_selector()?;
        let decoded_args =
            abi_formatter.decode_fn_args(&fn_selector, call.encoded_args.as_slice())?;

        eprintln!(
            "The script called: {fn_selector}({})",
            decoded_args.join(", ")
        );

        // ANCHOR_END: decoding_script_transactions
        Ok(())
    }
}\n```
```

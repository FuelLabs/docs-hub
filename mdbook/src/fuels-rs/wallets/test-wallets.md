# Setting up test wallets

You'll often want to create one or more test wallets when testing your contracts. Here's how to do it.

## Setting up multiple test wallets

<!-- This section should explain setting up multiple test wallets -->
<!-- test_wallets:example:start -->
If you need multiple test wallets, they can be set up using the `launch_custom_provider_and_get_wallets` method.
<!-- test_wallets:example:end -->

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

<!-- This section should explain how to customize test wallets -->
<!-- custom_test_wallets:example:start -->
You can customize your test wallets via `WalletsConfig`.
<!-- custom_test_wallets:example:end -->

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

<!-- This section should explain that test wallets are deterministic -->
<!-- deterministic:example:start -->
>**Note** Wallets generated with `launch_provider_and_get_wallet` or `launch_custom_provider_and_get_wallets`
will have deterministic addresses.
<!-- deterministic:example:end -->

## Setting up a test wallet with multiple random assets

You can create a test wallet containing multiple assets (including the base asset to pay for gas).

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

- coins: `Vec<(UtxoId, Coin)>` has `num_assets` * `coins_per_assets` coins (UTXOs)
- asset_ids: `Vec<AssetId>` contains the `num_assets` randomly generated `AssetId`s (always includes the base asset)

## Setting up a test wallet with multiple custom assets

You can also create assets with specific `AssetId`s, coin amounts, and number of coins.

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

This can also be achieved directly with the `WalletsConfig`.

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

>**Note** In this case, you need to manually add the base asset and the corresponding number of
>coins and coin amount

## Setting up assets

The Fuel blockchain holds many different assets; you can create your asset with its unique `AssetId` or create random assets for testing purposes.

You can use only one asset to pay for transaction fees and gas: the base asset, whose `AssetId` is `0x000...0`, a 32-byte zeroed value.

For testing purposes, you can configure coins and amounts for assets. You can use `setup_multiple_assets_coins`:

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

>**Note** If setting up multiple assets, one of these assets will always be the base asset.

If you want to create coins only with the base asset, then you can use:

```rust,ignore
```rust\n#[cfg(test)]
mod tests {
    use std::time::Duration;

    use fuels::prelude::Result;

    #[ignore = "testnet currently not compatible with the sdk"]
    #[tokio::test]
    async fn connect_to_fuel_node() -> Result<()> {
        // ANCHOR: connect_to_testnet
        use std::str::FromStr;

        use fuels::{crypto::SecretKey, prelude::*};

        // Create a provider pointing to the testnet.
        let provider = Provider::connect("testnet.fuel.network").await.unwrap();

        // Setup a private key
        let secret = SecretKey::from_str(
            "a1447cd75accc6b71a976fd3401a1f6ce318d27ba660b0315ee6ac347bf39568",
        )?;

        // Create the wallet
        let wallet = WalletUnlocked::new_from_private_key(secret, Some(provider));

        // Get the wallet address. Used later with the faucet
        dbg!(wallet.address().to_string());
        // ANCHOR_END: connect_to_testnet

        let provider = setup_test_provider(vec![], vec![], None, None).await?;
        let port = provider.url().split(':').last().unwrap();

        // ANCHOR: local_node_address
        let _provider = Provider::connect(format!("127.0.0.1:{port}")).await?;
        // ANCHOR_END: local_node_address

        Ok(())
    }

    #[tokio::test]
    async fn query_the_blockchain() -> Result<()> {
        // ANCHOR: setup_test_blockchain
        use fuels::prelude::*;

        // Set up our test blockchain.

        // Create a random wallet (more on wallets later).
        // ANCHOR: setup_single_asset
        let wallet = WalletUnlocked::new_random(None);

        // How many coins in our wallet.
        let number_of_coins = 1;

        // The amount/value in each coin in our wallet.
        let amount_per_coin = 3;

        let coins = setup_single_asset_coins(
            wallet.address(),
            AssetId::zeroed(),
            number_of_coins,
            amount_per_coin,
        );
        // ANCHOR_END: setup_single_asset

        // ANCHOR: configure_retry
        let retry_config = RetryConfig::new(3, Backoff::Fixed(Duration::from_secs(2)))?;
        let provider = setup_test_provider(coins.clone(), vec![], None, None)
            .await?
            .with_retry_config(retry_config);
        // ANCHOR_END: configure_retry
        // ANCHOR_END: setup_test_blockchain

        // ANCHOR: get_coins
        let consensus_parameters = provider.consensus_parameters().await?;
        let coins = provider
            .get_coins(wallet.address(), *consensus_parameters.base_asset_id())
            .await?;
        assert_eq!(coins.len(), 1);
        // ANCHOR_END: get_coins

        // ANCHOR: get_spendable_resources
        let filter = ResourceFilter {
            from: wallet.address().clone(),
            amount: 1,
            ..Default::default()
        };
        let spendable_resources = provider.get_spendable_resources(filter).await?;
        assert_eq!(spendable_resources.len(), 1);
        // ANCHOR_END: get_spendable_resources

        // ANCHOR: get_balances
        let _balances = provider.get_balances(wallet.address()).await?;
        // ANCHOR_END: get_balances

        Ok(())
    }
}\n```
```

>**Note** Choosing a large number of coins and assets for `setup_multiple_assets_coins` or `setup_single_asset_coins` can lead to considerable runtime for these methods. This will be improved in the future but for now, we recommend using up to **1_000_000** coins, or **1000** coins and assets simultaneously.

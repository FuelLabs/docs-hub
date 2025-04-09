# Deposit and withdraw

Consider the following contract:

```rust,ignore
contract;

use std::{
    asset::{
        mint_to,
        transfer,
    },
    call_frames::{
        msg_asset_id,
    },
    constants::ZERO_B256,
    context::msg_amount,
};

abi LiquidityPool {
    #[payable]
    fn deposit(recipient: Identity);
    #[payable]
    fn withdraw(recipient: Identity);
}

const BASE_TOKEN: AssetId = AssetId::from(0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c);

impl LiquidityPool for Contract {
    #[payable]
    fn deposit(recipient: Identity) {
        assert(BASE_TOKEN == msg_asset_id());
        assert(0 < msg_amount());

        // Mint two times the amount.
        let amount_to_mint = msg_amount() * 2;

        // Mint some LP token based upon the amount of the base token.
        mint_to(recipient, ZERO_B256, amount_to_mint);
    }

    #[payable]
    fn withdraw(recipient: Identity) {
        assert(0 < msg_amount());

        // Amount to withdraw.
        let amount_to_transfer = msg_amount() / 2;

        // Transfer base token to recipient.
        transfer(recipient, BASE_TOKEN, amount_to_transfer);
    }
}
```

As its name suggests, it represents a simplified example of a liquidity pool contract. The method `deposit()` expects you to supply an arbitrary amount of the `BASE_TOKEN`. As a result, it mints double the amount of the liquidity asset to the calling address. Analogously, if you call `withdraw()` supplying it with the liquidity asset, it will transfer half that amount of the `BASE_TOKEN` back to the calling address except for deducting it from the contract balance instead of minting it.

The first step towards interacting with any contract in the Rust SDK is calling the `abigen!` macro to generate type-safe Rust bindings for the contract methods:

```rust,ignore
abigen!(Contract(
            name = "MyContract",
            abi = "e2e/sway/contracts/liquidity_pool/out/release/liquidity_pool-abi.json"
        ));
```

Next, we set up a wallet with custom-defined assets. We give our wallet some of the contracts `BASE_TOKEN` and the default asset (required for contract deployment):

```rust,ignore
let base_asset_id: AssetId =
            "0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c".parse()?;

        let asset_ids = [AssetId::zeroed(), base_asset_id];
        let asset_configs = asset_ids
            .map(|id| AssetConfig {
                id,
                num_coins: 1,
                coin_amount: 1_000_000,
            })
            .into();

        let wallet_config = WalletsConfig::new_multiple_assets(1, asset_configs);
        let wallets = launch_custom_provider_and_get_wallets(wallet_config, None, None).await?;
        let wallet = &wallets[0];
```

Having launched a provider and created the wallet, we can deploy our contract and create an instance of its methods:

```rust,ignore
let contract_id = Contract::load_from(
            "../../e2e/sway/contracts/liquidity_pool/out/release/liquidity_pool.bin",
            LoadConfiguration::default(),
        )?
        .deploy(wallet, TxPolicies::default())
        .await?;

        let contract_methods = MyContract::new(contract_id.clone(), wallet.clone()).methods();
```

With the preparations out of the way, we can finally deposit to the liquidity pool by calling `deposit()` via the contract instance. Since we have to transfer assets to the contract, we create the appropriate `CallParameters` and chain them to the method call. To receive the minted liquidity pool asset, we have to append a variable output to our contract call.

```rust,ignore
let deposit_amount = 1_000_000;
        let call_params = CallParameters::default()
            .with_amount(deposit_amount)
            .with_asset_id(base_asset_id);

        contract_methods
            .deposit(wallet.address().into())
            .call_params(call_params)?
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;
```

As a final demonstration, let's use all our liquidity asset balance to withdraw from the pool and confirm we retrieved the initial amount. For this, we get our liquidity asset balance and supply it to the `withdraw()` call via `CallParameters`.

```rust,ignore
let lp_asset_id = contract_id.asset_id(&Bits256::zeroed());
        let lp_token_balance = wallet.get_asset_balance(&lp_asset_id).await?;

        let call_params = CallParameters::default()
            .with_amount(lp_token_balance)
            .with_asset_id(lp_asset_id);

        contract_methods
            .withdraw(wallet.address().into())
            .call_params(call_params)?
            .with_variable_output_policy(VariableOutputPolicy::Exactly(1))
            .call()
            .await?;

        let base_balance = wallet.get_asset_balance(&base_asset_id).await?;
        assert_eq!(base_balance, deposit_amount);
```

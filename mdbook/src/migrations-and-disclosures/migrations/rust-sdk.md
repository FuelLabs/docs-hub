# Rust SDK Migrations Guide

## March 17, 2025

[Release v0.71.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.71.0)

### Bump minimum `fuel-core-*` versions - [#1600](https://github.com/FuelLabs/fuels-rs/pull/1600)

Minimum `fuel-core-*` versions bumped to `0.41.7`

```rust
// before
fuel-core = { version = "0.41.3", default-features = false, features = [
  "wasm-executor",
] }
fuel-core-chain-config = { version = "0.41.3", default-features = false }
...
```

```rust
// after
fuel-core = { version = "0.41.7", default-features = false, features = [
  "wasm-executor",
] }
fuel-core-chain-config = { version = "0.41.7", default-features = false }
...
```

### Wallet refactoring - [#1620](https://github.com/FuelLabs/fuels-rs/pull/1620)

#### `ImpersonatedAccount` is removed

To achieve the same functionality instantiate a `FakeSigner:

```rust
// before
let address =
    Address::from_str("0x17f46f562778f4bb5fe368eeae4985197db51d80c83494ea7f84c530172dedd1")
        .unwrap();
let address = Bech32Address::from(address);
let impersonator = ImpersonatedAccount::new(address, Some(provider.clone()));
```

```rust
// after
let some_address = wallet.address().clone();
let fake_signer = FakeSigner::new(some_address);
let impersonator = Wallet::new(fake_signer, provider.clone());
```

#### `AwsKmsSigner` and `GoogleKmsSigner` moved

under `fuels::accounts::signers::kms::aws` and `fuels::accounts::signers::kms::google`, respectfully.

```rust
// before
use fuels::accounts::kms::AwsKmsSigner;
use fuels::accounts::kms::GoogleKmsSigner;
```

```rust
// after
use fuels::accounts::signers::kms::aws::AwsKmsSigner;
use fuels::accounts::signers::kms::google::GoogleKmsSigner;
```

#### `KmsWallet` removed

use an ordinary `Wallet` now with a kms signer (aws or google)

#### `WalletUnlocked` and `Wallet` substituted by `Wallet<Unlocked<S = PrivateKeySigner>>` or `Wallet<Locked>`

```rust
// before
wallet.set_provider(provider.clone());

...

let mut wallet = WalletUnlocked::new_random(None);

let coins: Vec<Coin> = setup_single_asset_coins(
    wallet.address(),
    Default::default(),
    DEFAULT_NUM_COINS,
    DEFAULT_COIN_AMOUNT,
);

let chain_config = ChainConfig {
    consensus_parameters: consensus_parameters.clone(),
    ..ChainConfig::default()
};

let provider = setup_test_provider(coins, vec![], None, Some(chain_config)).await?;
wallet.set_provider(provider.clone());
assert_eq!(consensus_parameters, provider.consensus_parameters().await?);

...

let wallet = WalletUnlocked::new_random(None);
```

```rust
// after
let wallet = Wallet::new(signer, provider.clone());

...

let mut rng = thread_rng();
let signer = PrivateKeySigner::random(&mut rng);

let coins: Vec<Coin> = setup_single_asset_coins(
    signer.address(),
    Default::default(),
    DEFAULT_NUM_COINS,
    DEFAULT_COIN_AMOUNT,
);
let chain_config = ChainConfig {
    consensus_parameters: consensus_parameters.clone(),
    ..ChainConfig::default()
};

let provider = setup_test_provider(coins, vec![], None, Some(chain_config)).await?;
let wallet = Wallet::new(signer, provider.clone());
assert_eq!(consensus_parameters, provider.consensus_parameters().await?);

...

let wallet = launch_provider_and_get_wallet().await?;
```

The provider is now mandatory for `Wallet::new`.

Common operations in the new API:

##### Creating a random wallet

a) Two step (useful when you haven't started the node but need the address)

```rust
    // Create a random private key signer
    let signer = PrivateKeySigner::random(&mut rng);
    let coins = setup_single_asset_coins(signer.address(), asset_id, 1, DEFAULT_COIN_AMOUNT);
    let provider = setup_test_provider(coins.clone(), vec![], None, None).await?;
    let wallet = Wallet::new(signer, provider);
 ```

b) One step (when you already have a provider)

```rust
    let wallet = Wallet::random(&mut rng, provider.clone());
```

##### Locking a wallet

```rust
    let locked_wallet = wallet.lock();
```

##### Creating a locked wallet

```rust
    let wallet = Wallet::new_locked(addr, provider.clone());
```

##### Wallets no longer sign

You use one of the signers for that. Or, if your wallet is unlocked, get its signer by calling `wallet.signer()`.

#### `ViewOnlyAccount` no longer requires `core::fmt::Debug` and `core::clone::Clone` as supertraits

#### `Wallet` no longer handles encrypting keys for disk storage

Use the `fuels::accounts::Keystore` for that (feature-gated under `accounts-keystore`)

#### AWS/Google kms feature flags changed

They're now `accounts-signer-aws-kms` and `accounts-signer-google-kms`.

### Use `total_gas` and `total_fee` from tx status - [#1574](https://github.com/FuelLabs/fuels-rs/pull/1574)

- Removed `get_response_from` method from `CallHandlers`
- `CallResponse` refactored and added `tx_status: Success` field
- Method `get_response` accepts `TxStatus` instead of `Vec<Receipts>`
- Method `new` is removed form `CallResponse`
- `GasValidation` trait is removed from transaction builders
- `Account`s  `transfer` method returns `Result<TxResponse>`
- `Account`s  `force_transfer_to_contract` method returns `Result<TxResponse>`
- `Account`s  `withdraw_to_base_layer` method returns `Result<WithdrawToBaseResponse>`
- `Executable<Loader>`'s `upload_blob` returns `Result<Option<TxResponse>>`
- Contract's `deploy` and `deploy_if_not_exists` return `Result<DeployResponse>` and `Response<Option<DeployResponse>>` respectively
- `TransactionCost`'s field `gas_used` renamed to `script_gas`

## August 16, 2024

[Release v0.66.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.66.0)

### Unfunded read only calls - [#1412](https://github.com/FuelLabs/fuels-rs/pull/1412)

`SizedAsciiString` no longer implements `AsRef<[u8]>`. To get the underlying bytes you can turn it into a `&str` via the new `AsRef<str>` and call `as_bytes()` on the `&str`: `sized_string.as_ref().as_bytes()``

```rust
// before
let bytes: &[u8] = sized_str.as_ref();
```

```rust
// after
let bytes: &[u8] = sized_str.as_ref().as_bytes();
```

`build_without_signatures` is now achieved by setting the build strategy to `BuildStrategy::NoSignatures` on the transaction builder before calling `build`

```rust
// before
let mut tx = tb.build_without_signatures(provider).await?;
```

```rust
// after
let mut tx = tb.with_build_strategy(ScriptBuildStrategy::NoSignatures).build(provider).await?;
```

`.simulate()` now accepts an `Execution` argument allowing for `Realistic` or `StateReadOnly` simulations.

```rust
// before
let stored = contract_methods.read().simulate().await?;
```

```rust
// after
let stored = contract_methods.read().simulate(Execution::StateReadOnly).await?;
```

### Accounts now cover max fee increase due to tolerance - [#1464](https://github.com/FuelLabs/fuels-rs/pull/1464)

`fee_checked_from_tx` is removed from all transaction builders. max fee can now be estimated using the new method `estimate_max_fee` which takes into account the max fee estimation tolerance set on the builders.

```rust
// before
let transaction_fee = tb.fee_checked_from_tx(provider)
    .await?
    .ok_or(error_transaction!(
        Other,
        "error calculating `TransactionFee`"
    ))?;

let total_used = transaction_fee.max_fee() + reserved_base_amount;
```

```rust
// after
let max_fee = tb.estimate_max_fee(provider).await?;

let total_used = max_fee + reserved_base_amount;
```

### Account impersonation - [#1473](https://github.com/FuelLabs/fuels-rs/pull/1473)

The SDK previously performed transaction validity checks, including signature verification, before sending a transaction to the network. This was problematic since the checks also included signature verification even when utxo validation was turned off. To enable this feature and prevent future issues like failed validation checks due to version mismatches between the network and the SDK's upstream dependencies, we decided to remove the check. Since the SDK already abstracts building transactions for common cases (contract calls, transfers, etc.), validity issues are unlikely. If needed, we can still expose the validity checks as part of the transaction builder or our transaction structs.

```rust
/*

A `ImpersonatedAccount` simulates ownership of assets held by an account with a given address.
`ImpersonatedAccount` will only succeed in unlocking assets if the the network is setup with
utxo_validation set to false.

*/

let node_config = NodeConfig {
    utxo_validation: false,
    ..Default::default()
};
```

### Deploying large contracts (loader + blob support) - [#1472](https://github.com/FuelLabs/fuels-rs/pull/1472)

`Contract::new` is removed, replaced with `Contract::regular` with three states

First: A regular contract

What you're used to seeing. It is either initialized from raw code or loaded from a file:

```rust
let contract = Contract::regular(contract_binary, Salt::zeroed(), vec![]);
```

or

```rust
let contract = Contract::load_from(
    "sway/contracts/storage/out/release/storage.bin",
    LoadConfiguration::default(),
)?;
```

With the notable addition of being able to set `configurables` (previously possible only when using `load_from`):

```rust
let contract = Contract::regular(binary, Salt::zeroed(), vec![]).with_configurables(configurables);
```

a regular contract can be deployed via `deploy`, which hasn't changed, or via `smart_deploy` that will use blobs/loader if the contract is above what can be deployed in a create tx:

```rust
let contract_id = Contract::load_from(
    contract_binary,
    LoadConfiguration::default().with_salt(random_salt()),
)?
.smart_deploy(&wallet, TxPolicies::default(), max_words_per_blob)
.await?;
```

Second: Loader contract, blobs pending upload

You can turn a regular contract into a loader contract:

```rust
let contract = Contract::load_from(
    contract_binary,
    LoadConfiguration::default(),
)?
.convert_to_loader(max_words_per_blob)?
```

or, if you have the blobs, create it directly:

```rust
let contract = Contract::loader_for_blobs(blobs, random_salt(), vec![])?;
```

You can also revert back to the regular contract via `revert_to_regular`.

If you now call `deploy` the contract will first deploy the blobs and then the loader itself.

You can also split this into two parts by first calling `upload_blobs` and then `deploy`:

```rust
let contract_id = Contract::load_from(contract_binary, LoadConfiguration::default())?
    .convert_to_loader(1024)?
    .upload_blobs(&wallet, TxPolicies::default())
    .await?
    .deploy(&wallet, TxPolicies::default())
    .await?;
```

doing so will have `deploy` only submit the create tx while the uploading will be done in `upload_blobs`.

Third: Loader, with blobs deployed

You arrive at this contract type by either having the blob ids and creating it manually:

```rust
let contract = Contract::loader_for_blob_ids(all_blob_ids, random_salt(), vec![])?;
```

or by calling `upload_blobs` as in the previous case:

```rust
let contract = Contract::load_from(
    contract_binary,
    LoadConfiguration::default().with_salt(random_salt()),
)?
.convert_to_loader(max_words_per_blob)?
.upload_blobs(&wallet, TxPolicies::default())
.await?;
```

Calling deploy on this contract only deploys the loader.

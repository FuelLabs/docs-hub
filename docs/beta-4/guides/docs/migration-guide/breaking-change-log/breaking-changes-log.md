---
title: Breaking Changes Log
category: Migration Guide
parent:
  label: Guides
  link: /guides
---

# Breaking Changes Log

## October 2, 2023

### TS SDK

Release: [TS SDK v0.60.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.60.0)

`Provider` is used so widely in our SDK, there are multiple breaking changes that we need to be aware of and need to communicate to our users:

```typescript
/* BEFORE - v0.57.0 */
const provider = new Provider(url)

/* AFTER - v0.60.0 */
const provider = await Provider.create(url)
```

All of these methods now require a `Provider` to be passed in:

#### Wallet Methods

Some of these methods used to accept a URL instead of a `Provider` object. Note that the `provider` parameter *has* to be a `Provider` object now.

```typescript
const provider = await Provider.create(url);
```

```typescript
/* BEFORE - v0.57.0 */
WalletUnlocked.fromSeed(seed, path);

WalletUnlocked.fromMnemonic(mnemonic, path, passphrase);

WalletUnlocked.fromExtendedKey(extendedKey);
await WalletUnlocked.fromEncryptedJson(jsonWallet, password);

Wallet.fromAddress(address);

Wallet.fromPrivateKey(pk);

Wallet.generate();

/* AFTER - v0.60.0 */
WalletUnlocked.fromSeed(seed, provider, path);

WalletUnlocked.fromMnemonic(mnemonic, provider, path, passphrase);

WalletUnlocked.fromExtendedKey(extendedKey, provider);
await WalletUnlocked.fromEncryptedJson(jsonWallet, password, provider);

Wallet.fromAddress(address, provider);

Wallet.fromPrivateKey(pk, provider);

Wallet.generate({ provider });
```

#### 'Account' Class

```typescript
/* BEFORE - v0.57.0 */
const account = new Account(address);

/* AFTER - v0.60.0 */
const account = new Account(address, provider);
```

#### `PrivateKeyVault`

These are the options that are accepted by the `PrivateKeyVault` constructor. `provider` is now a required input.

```typescript
/* BEFORE - v0.57.0 */
interface PkVaultOptions {
  secret?: string;
  accounts?: Array<string>;
}

/* AFTER - v0.60.0 */
interface PkVaultOptions {
  secret?: string;
  accounts?: Array<string>;
  provider: Provider;
}
```

#### `MnemonicVault`

```typescript
/* BEFORE - v0.57.0 */
interface MnemonicVaultOptions {
  secret?: string;
  accounts?: Array<string>;
}

/* AFTER - v0.60.0 */
interface MnemonicVaultOptions {
  secret?: string;
  accounts?: Array<string>;
  provider: Provider;
}
```

#### `WalletManager`

```typescript
/* BEFORE - v0.57.0 */
export type VaultConfig = {
  type: string;
  title?: string;
  secret?: string;
};

/* AFTER - v0.60.0 */
export type VaultConfig = {
  type: string;
  title?: string;
  secret?: string;
  provider: Provider;
};
```

#### Predicates

The `provider` is no longer optional. Note the change in parameter order, and that `chainId` is no longer required to be passed.

```typescript
/* BEFORE - v0.57.0 */ 
const predicate = new Predicate(bytes, chainId, jsonAbi);

/* AFTER - v0.60.0 */ 
const predicate = new Predicate(bytes, provider, jsonAbi);
```

## September 18, 2023

### Sway

Release: [Sway v0.46.0](https://github.com/FuelLabs/sway/releases/tag/v0.46.0)

From now on, string literals produce the `str` slice type instead of the string array type. To convert between string arrays and slices, you can use the newly provided intrinsics.

```sway
/* BEFORE - v0.45.0 */
let my_string: str[4] = "fuel";

/* AFTER - v0.46.0 */
let my_string: str = "fuel";
```

If you use a function that needs a specific trait and you don't import that trait, the compiler now will raise an error. This is because the compiler isn't aware of the trait in the current context.

For the example below you would now get an error if the `Hash` trait for `u64` isn't imported. To solve this, ensure you import the "Hash" trait.

```sway
/* BEFORE - v0.45.0 */
storage {
    item_map: StorageMap<u64, Item> = StorageMap {},
}

/* AFTER - v0.46.0 */
use std::{
    hash::Hash,
};

storage {
    item_map: StorageMap<u64, Item> = StorageMap {},
}
```

### TS SDK

Release: [TS SDK v0.57.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.57.0)

The `addResourceInputsAndOutputs()` function has been renamed to `addResources()`, streamlining its name.

```typescript
/* BEFORE - v0.55.0 */
request.addResourceInputsAndOutputs(resources);

/* AFTER - v0.57.0 */
request.addResources(resources);
```

Similarly, `addPredicateResourcesInputsAndOutputs()` is now more concisely known as `addPredicateResources()`.

The reason we have a distinct method for adding predicate resources is that the creation of predicate inputs mandates the presence of both the predicate's bytes and data bytes. With these methods, there's no longer a need to manually create and set up an instance of a `ScriptTransactionRequest`, simplifying the process further.

```typescript
/* BEFORE - v0.55.0 */
const predicateInputs: TransactionRequestInput[] = predicateUtxos.map((utxo) => ({
  id: utxo.id,
  type: InputType.Coin,
  amount: utxo.amount,
  assetId: utxo.assetId,
  owner: utxo.owner.toB256(),
  txPointer: '0x00000000000000000000000000000000',
  witnessIndex: 0,
  maturity: 0,
  predicate: predicate.bytes,
  predicateData: predicate.predicateData,
}));

/* AFTER - v0.57.0 */
request.addPredicateResources(predicateUtxos, predicate.bytes, predicate.predicateData)
```

### Rust SDK

Release: [Rust SDK v0.48.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.48.0)

The function `calculate_base_amount_with_fee()` currently returns a value of type `Option<64>`.

```rust
/* BEFORE - v0.47.0 */
let new_base_amount = calculate_base_amount_with_fee(&tb, &consensus_parameters, previous_base_amount)

/* AFTER - v0.48.0 */
let new_base_amount = calculate_base_amount_with_fee(&tb, &consensus_parameters, previous_base_amount)?
```

The function `calculate_base_amount_with_fee()` now returns a value of type `Result<Option<TransactionFee>>` instead of `Option<TransactionFee>`.

```rust
/* BEFORE - v0.47.0 */
let transaction_fee = tb.fee_checked_from_tx(consensus_params).expect("Error calculating TransactionFee");

/* AFTER - v0.48.0 */
let transaction_fee = tb.fee_checked_from_tx(consensus_params)?.ok_or(error!(InvalidData, "Error calculating TransactionFee"))?;
```

Storage slots are now automatically loaded in when using the default configuration.

```rust
/* BEFORE - v0.47.0 */
let storage_config =
StorageConfiguration::load_from("out/debug/contract-storage_slots.json").unwrap();

let load_config = LoadConfiguration::default().with_storage_configuration(storage_config);

let id = Contract::load_from(
    "./out/debug/contract.bin",
    load_config,
)
.unwrap()
.deploy(&wallet, TxParameters::default())
.await
.unwrap();

/* AFTER - v0.48.0 */
let id = Contract::load_from(
    "./out/debug/contract.bin",
    LoadConfiguration::default(),
)
.unwrap()
.deploy(&wallet, TxParameters::default())
.await
.unwrap();
```

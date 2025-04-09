# Beta 3-5 Testnet Breaking Change Guide (Archive)

## April 30, 2024

### Sway

Release: [Sway v0.56.0](https://github.com/FuelLabs/sway/releases/tag/v0.56.0)

The `std::call_frames::second_param` function now returns a `u64` instead of a generic type `T`.

`contract_id()` has been removed in favor of `ContractId::this()`.

```rust
/* BEFORE */
let contract_id = contract_id();

/* AFTER */
let contract_id = ContractId::this();
```

`call_with_function_selector_vec` has been removed in favor of `call_with_function_selector`.

```rust
/* BEFORE */
pub fn call_with_function_selector_vec(
  target: ContractId,
  function_selector: Vec<u8>,
  calldata: Vec<u8>,
  single_value_type_arg: bool,
  call_params: CallParams
) {...}

/* AFTER */
pub fn call_with_function_selector_vec(
  target: ContractId,
  function_selector: Bytes // new
  calldata: Bytes, // new
  call_params: CallParams
) {...}
```

The `BASE_ASSET_ID` constant has been removed, and `AssetId::base_asset_id()` is now `AssetId::base()`.

```rust
/* BEFORE */
let base_asset_id = BASE_ASSET_ID;
/* OR */
let base_asset_id = AssetId::base_asset_id();

/* AFTER */
let base_asset_id = AssetId:base();
```

You can no longer access the following:

- `force_transfer_to_contract()`
- `transfer_to_address()`
- `mint_to_contract()`
- `mint_to_address()`

Instead use the `transfer()`, `mint()`, and `mint_to()` functions accordingly.

```rust
/* BEFORE */
let user = Address:from(address);
mint_to_address(user, ZERO_B256, amount);

/* AFTER */
mint_to(Identity::Address(user), ZERO_B256, amount);
```

The new encoding (encoding v1) is now set by default.  If you would like to build your forc project without v1 encoding then run the following command:

```sh
forc build --no-encoding-v1
```

`run_external` in sway-lib-std has been removed until LDC is stabilized.

Release: [Sway v0.55.0](https://github.com/FuelLabs/sway/releases/tag/v0.55.0)

`GTF` constants along with the following functions have been removed to match the current Fuel VM instruction set:

- `input_maturity()`
- `tx_receipts_root()`

`tx_gas_price` has been renamed `tx_tip`

```rust
/* BEFORE */
let gas_price = tx_gas_price();

/* AFTER */
let tip = tx_tip();
```

Release: [Sway v0.54.0](https://github.com/FuelLabs/sway/releases/tag/v0.54.0)

The `forc-client` and `forc-tx` plugins now take `u16` instead of `u8` for witness index types.

### TS-SDK

Release [v0.83.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.83.0)

`BaseAssetId` is no longer exported by `fuels`. It can be fetched from a `Provider`.

```ts
/* BEFORE */
import { BasedAssetId } from "fuels";

/* AFTER */
const provider = await Provider.create(FUEL_NETWORK_URL);
const baseAssetId = provider.getBaseAssetId();
```

`TransactionRequest.addCoinOutput` and `TransactionRequest.addChangeOutput` now requires an `assetId`, it no longer defaults to the `BaseAssetId`.

`TransactionRequest.fundWithFakeUtxos` now requires passing the `baseAssetId` as a function parameter. This is the only function that is base asset aware, so that it can be used specifically to estimate the transaction cost.

`CoinQuantityLike` now requires an `AssetId`. Previously most of it's usages would default to the `BaseAssetId`, as this must now be fetched, so it must be passed to the type.

```ts
/* BEFORE */
let coin: CoinQuantityLike = [1000];
coin = { amount: 1000 };

/* AFTER */
const assetId = "0x..";
let coin: CoinQuantityLike = [1000, assetId];
coin = { amount: 1000, assetId };
```

`gasPrice` is calculated by the VM so we do not need use it anymore.

```ts
/* BEFORE */
await factory.deployContract({ gasPrice });

/* AFTER */
await factory.deployContract();
```

`PolicyType.GasPrice` is now `PolicyType.Tip`.

The `Account.fund` function parameters changed.  Also the information returned by `Provider.getTransactionCost` is useful here because it can be passed as the second parameter to `Account.fund`.

```ts
/* BEFORE */
async fund<T extends TransactionRequest>(
    request: T,
    coinQuantities: CoinQuantity[],
    fee: BN,
    inputsWithEstimatedPredicates: TransactionRequestInput[],
    addedSignatures?: number
): Promise<T>

/* AFTER */
export type EstimatedTxParams = {
  maxFee: BN;
  estimatedPredicates: TransactionRequestInput[];
  addedSignatures: number;
  requiredQuantities: CoinQuantity[];
}
async fund<T extends TransactionRequest>(request: T, params: EstimatedTxParams): Promise<T>
```

GraphQL URL now includes a versioning path: `http://127.0.0.1:4000/v1/graphql`.

`calculateTransactionFee` now requires `tip`, `maxGasPerTx`, and `gasPrice`. Also `gasUsed` is not used anymore.

```ts
/* BEFORE */
const { fee } = calculateTransactionFee({
  gasUsed,
  rawPayload,
  consensusParameters: {
    gasCosts,
    feeParams: {
      gasPerByte,
      gasPriceFactor,
    },
  },
});

/* AFTER */
const { fee } = calculateTransactionFee({
  gasPrice, // new
  tip, // new
  consensusParameters: {
    maxGasPerTx, // new
    gasCosts,
    feeParams: {
      gasPerByte,
      gasPriceFactor,
    },
  },
  rawPayload,
});
```

Due to `forc` upgrade [v0.52.0](https://github.com/FuelLabs/sway/releases/tag/v0.52.0) `AssetId` and `EvmAddress` property `value` was renamed to `bits`

```ts
/* BEFORE */
export type EvmAddress = {
  value: B256AddressEvm;
};
export type AssetId = {
  value: B256Address;
};

/* AFTER */
export type EvmAddress = {
  bits: B256AddressEvm;
};
export type AssetId = {
  bits: B256Address;
};
```

Release [v0.80.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.80.0)

Removed unused property `usedFee` from `Provider.getTransactionCost` response.

Renamed `getAssetId` to `getMintedAssetId`.

### Rust SDK

Release [v0.58.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.58.0)

The new encoding is now the default encoding. Use the following command if you would like to run your cargo tests with the legacy encoding.

```sh
cargo test --features legacy_encoding
```

Release [v0.57.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.57.0)

The `BASE_ASSET_ID` constant has been removed and replaced by a new `Provider` function.

```rust
/* BEFORE */
let base_asset_id = BASE_ASSET_ID;

/* AFTER */
let base_asset_id = provider.base_asset_id();
```

`Config` was renamed to `NodeConfig`

```rust
/* BEFORE */
let node_config = Config::default();

/* AFTER */
let node_config = NodeConfig::default();
```

`FuelService::start()` now accepts `NodeConfig`, `ChainConfig`, and `StateConfig` as arguments to startup a node.

```rust
/* BEFORE */
let server = FuelService::start(Config::default()).await?;

/* AFTER */
let server = FuelService::start(
  NodeConfig::default(),
  ChainConfig::default(),
  StateConfig::default(),
)
.await?;
```

When instantiating `ConsensusParameters` you must make use of setters.

```rust
/* BEFORE */
let consensus_parameters = ConsensusParameters {
    tx_params,
    fee_params,
    ..Default::default()
};

/* AFTER */
let mut consensus_parameters = ConsensusParameters::default();
consensus_parameters.set_tx_params(tx_params);
consensus_parameters.set_fee_params(fee_params);
```

Fields now need to be accessed via methods.

```rust
/* BEFORE */
let chain_id = consensus_parameters.chain_id;

/* AFTER */
let chain_id = consensus_parameters.chain_id();
```

The same applies to other parameter structs used when setting up a node, such as `TxParameters`, `ContractParameters`, `PredicateParameters` etc.

The `witness_index` parameters in `CreateTransactionBuilder::with_bytecode_witness_index` are now a `u16`.

`NodeInfo` no longer has `min_gas_price`.

`CreateTransaction` no longer has `bytecode_length()`.

`Header` no longer has `message_receipt_root`, but gains:

```rust
pub message_outbox_root: Bytes32,
pub event_inbox_root: Bytes32,
pub consensus_parameters_version: u32,
pub state_transition_bytecode_version: u32
```

## March 27, 2024

### Sway

Release [Sway v0.52.0](https://github.com/FuelLabs/sway/releases/tag/v0.52.0)

The `bytes` field on `B512` and the `value` field `EvmAddress` have been renamed `bits`, made private, and made accessible via `bits()`.

```rust
/* BEFORE */
let bytes = myB12.bytes;
let value = myEvmAddress.value;

/* AFTER */
let bits = myB512.bits();
let bits = myEvmAddress.bits();
```

The fields on `U128` have been made private.

```rust
/* BEFORE */
let zero_u128 = U128 { upper: 0, lower: 0 };
let upper = zero_u128.upper;

/* AFTER */
let zero_u128 = U128::from(0, 0);
let upper = zero_u128.upper();
```

The fields on `StorageKey` have been made private and are now accessed via:

- `new()`
- `slot()`
- `offset()`
- `field_id()`

The following heap types have been updated to have private struct variables:

- `Bytes`
- `RawBytes`
- `Vec`
- `RawVec`
- `String`

```rust
/* BEFORE */
let bytes_ptr = bytes.buf.ptr();

/* AFTER */
let bytes_ptr = bytes.ptr();
```

The `value` field on `AssetId`, `ContractId`, and `Address` is now private and renamed `bits`.

```rust
/* BEFORE */
let value = assetId.value;

/* AFTER */
let bits = assetId.bits();
```

`predicate_id()` has been renamed to `predicate_address()`.

```rust
/* BEFORE */
let predicate = predicate_id();

/* AFTER */
let predicate = predicate_address();
```

`U256` has been removed use the native `u256` type instead.

```rust
/* BEFORE */
let my_U256 = U256::max();

/* AFTER */
let my_u256 = u256::max();
```

### TS-SDK

Release [v0.79.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.79.0)

`externalLoggedTypes` has been removed from the `Interface` class.

Release [v0.77.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.77.0)

Predicate data is now accepted on the `Predicate` constructor.

```ts
/* BEFORE */
const predicate = new Predicate(bytecode, provider, abi, configurableConstants);

/* AFTER */
const predicate = new Predicate({
  bytecode,
  abi, // optional
  provider,
  inputData, // optional
  configurableConstants, // optional
});
```

The `setData` method has been removed from `Predicate`. If you want to pass in predicate data after instantiating the `Predicate` or if you want to use different data than what was passed to the constructor, then you will have to create a new `Predicate` instance.

### Rust SDK

Release [v0.56.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.56.0)

Experimental encoding for logs was added. Use the following command to run your tests with the experimental encoding

```sh
cargo test --features experimental
```

**_NOTE_** experimental encoding is now the default encoding in [v0.57.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.57.0)

`Configurables` structs now need to be instantiated through a `::new(encoder_config)` or `::default()` method.

```rust
/* BEFORE */
let configurables = MyContractConfigurables::new().with_STRUCT(my_struct);

/* AFTER */
let configurables = MyContractConfigurables::default().with_STRUCT(my_struct);
/* OR */
let configurables = MyContractConfigurables::new(encoder_config).with_STRUCT(my_struct);
```

`Configurables::with_some_string_config(some_string)` methods now return a `Result<Configurables>` instead of `Configurables`.

`Predicates::encode_data` now returns a `Result<UnresolvedBytes>` instead of `UnresolvedBytes`.

`AbiEncoder` structs must be instantiated through a `::new(encoder_config)` or `::default()` method.

```rust
/* BEFORE */
let encoded = ABIEncoder::encode(&args).resolve(0);

/* AFTER */
let encoded = ABIEncoder::default().encode(&args).resolve(0);
/* OR */
let encoded = ABIEncoder::new(config).encode(&args).resolve(0);
```

`EnumVariants` are now imported through `param_types::EnumVariants`.

```rust
/* BEFORE */
use fuels::types::enum_variants::EnumVariants;

/* AFTER */
use fuels::types::param_types::EnumVariants;
```

`TxPolicies` `gas_price` is replaced with `tip`

```rust
/* BEFORE */
let tx_policies = TXPolicies::default().with_gas_price(1);

/* AFTER */
let tx_policies = TXPolicies::default().with_tip(1);
```

`checked_dry_run` has been removed from `Provider`.

`dry_run` now returns `Result<TxStatus>` instead of `Result<Vec<Receipt>>`. The receipts can be taken with `tx_status.take_receipts()`.

`TransactionResponse`'s `block_id` is replaced with `block_height`.

`estimate_transaction_cost` has a new argument `block_horizon: Option<u32>`.

```rust
/* BEFORE */
let transaction_cost = contract_instance
  .methods()
  .my_contract_call()
  .estimate_transaction_cost(Some(tolerance))
  .await?;

/* AFTER */
let transaction_cost = contract_instance
  .methods()
  .my_contract_call()
  .estimate_transaction_cost(tolerance, block_horizon)
  .await?;
```

## February 22, 2024

### Sway

Release: [Sway v0.51.0](https://github.com/FuelLabs/sway/releases/tag/v0.51.0)

You can no longer access private fields in structs.

```rust
/* BEFORE */
let private = my_struct.private // just a warning

/* AFTER */
let private = my_struct.private // ERROR
let private = my_struct.private() // you must create a function to access private variables
```

The `Never` type is now `!`.

```rust
/* BEFORE */
let x: NEVER = { return 123 };

/* AFTER */
let x: ! = { return 123 };
```

Release: [Sway v0.50.0](https://github.com/FuelLabs/sway/releases/tag/v0.50.0)

Configurables are now forbidden in const expressions.

```rust
// Not allowed
script;

configurable {
    VALUE: u64 = 42,
}

fn main() {
    const CONSTANT: u64 = VALUE;
}
```

Struct fields are now private by default.  You must explicitly mark a field public.

```rust
/* BEFORE */
pub struct Struct {
  public_field: u8,
}

/* AFTER */
pub struct Struct {
  pub public_field: u8,
  private_field: u8,
}
```

The `From` trait has been redesigned into the `From`/`Into` rust-like trait pair.

```rust
/* BEFORE */
impl From<b256> for Address {
  fn from(bits: b256) -> Self {
    Self { value: bits }
  }

  fn into(self) -> b256 {
    self.value
  }
}

let address = Address::from(ZERO_B256);
let b256_data = address.into();

/* AFTER */
impl From<b256> for Address {
  fn from(bits: b256) -> Self {
    Self { value: bits }
  }
}

impl From<Address> for b256 {
  fn from(address: Address) -> b256 {
    address.value
  }
}

let address = Address::from(ZERO_B256);
let b256_data: b256 = address.into();
let address: Address = b256_data.into();
```

### TS-SDK

Release: [v0.74.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.74.0)

`Provider` has been removed from `WalletManager` types.

```ts
/* Before */
const vault = new MnemonicVault({
  secret: mnemonic,
  provider,
});

/* After */
const vault = new MnemonicVault({
  secret: mnemonic,
});
```

The Account and account related packages have been restructured. Anything imported from the following packages will now be imported from `@fuel-ts/account`

- `@fuel-ts/hdwallet`
- `@fuel-ts/mnemonic`
- `@fuel-ts/predicate`
- `@fuel-ts/providers`
- `@fuel-ts/signer`
- `@fuel-ts/wallet-manager`
- `@fuel-ts/wallet`
- `@fuel-ts/wordlists`

## February 5, 2024 (Beta 5)

### Sway

Release: [Sway v0.49.2](https://github.com/FuelLabs/sway/releases/tag/v0.49.2)

Numerous elements in the standard library have undergone changes. The `token.sw` file has been renamed to `asset.sw`, impacting the `transfer()` and `mint_to()` functions. This modification aims to bring about greater consistency across all functions related to asset management.

```sway
/* BEFORE - v0.46.0 */
use std::{
    token::transfer

};
/* AFTER - v0.49.2 */
use std::{
    asset::transfer
};
```

The instructions `LW` (Load Word) and `SW` (Store Word) are now replaced with `LB` (Load Byte) and `SB` (Store Byte), specifically for smaller data types like `u8`. This adjustment allows these types to be contained within a single byte, rather than occupying a full word. However, for other data types such as `u16`, the original instruction format remains unchanged.

```sway
/* BEFORE - v0.46.0 */
sw   output r1 i0;

/* AFTER - v0.49.2 */
sb   output r1 i0;
```

`DEFAULT_SUB_ID` has been introduced to improve UX. It is equivalent to the `ZERO_B256` constant.

```sway
/* BEFORE - v0.46.0 */
use std::call_frames::contract_id;

fn foo(other_contract: ContractId) {
     let other_asset = AssetId::default(other_contract);
     let my_asset = AssetId::default(contract_id());
}

/* AFTER - v0.49.2 */
fn foo(other_contract: ContractId) {
     let other_asset = AssetId::new(other_contract, DEFAULT_SUB_ID);
     let my_asset = AssetId::default();
}
```

The `Eq` trait now exists for `Option`.

```sway
/* BEFORE - v0.46.0 */
let option1: Option<u64> = Some(5);
let option2: Option<u64> = Some(5);

match (option1, option2) {
    (Some(a), Some(b)) => a == b,
    (None, None) => true,
    _ => false,
}

/* AFTER - v0.49.2 */
let option1: Option<u64> = Some(5);
let option2: Option<u64> = Some(5);

if option1 == option2 {
    return true
} else {
    return false
}
```

The standard library `tx` introduces several new functions including `tx_max_fee()`, `tx_witness_limit()`, `script_gas_limit()`, and `policies()`. `tx_gas_limit()` has been deprecated to support the new `TxPolicy`, replacing `TxParameters`.

```sway
/* BEFORE - v0.46.0 */
fn get_tx_gas_limit() -> u64;

/* AFTER - v0.49.2 */
fn get_script_gas_limit() -> u64;
```

The existing functions inside the standard library `tx`, including `tx_gas_price()` and `tx_maturity()`, now return `Option<u64>` and `Option<u32>` respectively, instead of just `u64` and `u32`.

```sway
/* BEFORE - v0.46.0 */
fn get_tx_maturity() -> u32 {
    tx_maturity()
}

/* AFTER - v0.49.2 */
fn get_tx_maturity() -> u32 {
    tx_maturity().unwrap()
}
```

Along with these changes, GTF opcodes have been updated in the following standard libraries.

1. [inputs.sw](https://github.com/FuelLabs/sway/pull/5281/files#diff-427b18b1692c5ee5541b43013d9859363da2c2fa6e940b25045d2514cac97428)
2. [outputs.sw](https://github.com/FuelLabs/sway/pull/5281/files#diff-0625712126eb9f0c821b18e48379ad1213d6cbe0d38ba4fe721260232fb48eca)
3. [tx.sw](https://github.com/FuelLabs/sway/pull/5281/files#diff-038f9ff7e5241cc345c0d460a0100ab88fbc72ac76db0e9af923bc8342b5c0c9)

Byte conversions and array conversions for u256, u64, u32, u16, and b256 have been introduced into the standard library.

1. [Byte conversions](https://github.com/FuelLabs/sway/tree/master/sway-lib-std/src/bytes_conversions)

```sway
/* AFTER - v0.49.2 */
fn foo() {
  let x: u16 = 513;
  let result = x.to_le_bytes();

  assert(result[0] == 1_u8);
  assert(result[1] == 2_u8);
}
```

<!-- markdownlint-disable md029 -->

2. [Array conversions](https://github.com/FuelLabs/sway/tree/master/sway-lib-std/src/array_conversions)

```sway
/* AFTER - v0.49.2 */
fn foo() {
  let x: u16 = 513;
  let result = x.to_le_bytes();

  assert(result.get(0).unwrap() == 1_u8);
  assert(result.get(1).unwrap() == 2_u8);
}
```

<!-- markdownlint-enable md029 -->

Power uses a `u32` instead of self

```sway
/* BEFORE - v0.46.0 */
assert(2u16.pow(2u16) == 4u16);

/* AFTER - v0.49.2 */
assert(2u16.pow(2u32) == 4u16);
```

### TS SDK

Release: [TS SDK v0.73.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.73.0)

Several `fuel-core` configuration-related options have been removed from the `LaunchNodeOptions`. These include: `chainConfigPath`, `consensusKey`, `useInMemoryDb`, and `poaInstant`. These options can now only be passed through the `args` property.

```typescript
/* BEFORE - v0.60.0 */
const { cleanup, ip, port } = await launchNode({
  chainConfigPath,
  consensusKey = "0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298",
  args: defaultFuelCoreArgs,
});

/* AFTER - v0.73.0 */
const { cleanup, ip, port } = await launchNode({
  args: ["--poa-instant", "false", "--poa-interval-period", "400ms"],
});
```

Contract calls requires `gasLimit` and `gasPrice` to be specified in `txParams()`.

```typescript
/* BEFORE - v0.60.0 */
let resp = await contract.functions.count().simulate();

/* AFTER - v0.73.0 */
let resp = await contract.functions
  .count()
  .txParams({ gasPrice: 1, gasLimit: 100_000 })
  .simulate();
```

`chainInfoCache` and `nodeInfoCache` are now private methods, to prevent users from accessing invalid cached information after it becomes stale.

```typescript
/* BEFORE - v0.60.0 */
Provider.chainInfoCache[FUEL_NETWORK_URL];
Provider.nodeInfoCache[FUEL_NETWORK_URL];

/* AFTER - v0.73.0 */
provider.getChain();
provider.getNode();
```

The `switchURL()` method, used to update the URL for the provider, is now named `connect()`.

```typescript
/* BEFORE - v0.60.0 */
await provider.switchUrl(altProviderUrl);

/* AFTER - v0.73.0 */
await provider.connect(altProviderUrl);
```

Support for new Sway types has been introduced with:

1. Bytes

```typescript
/* AFTER - v0.73.0 */
const bytes = [40, 41, 42];
const { value } = await contract.functions.bytes_comparison(bytes).simulate();
```

<!-- markdownlint-disable md029 -->

2. Raw Slices

```typescript
/* AFTER - v0.73.0 */
const rawSlice = [40, 41, 42];
const { value } = await contract.functions
  .raw_slice_comparison(rawSlice)
  .simulate();
```

3. StdString

```typescript
/* AFTER - v0.73.0 */
const stdString = "Hello World";
const { value } = await contract.functions
  .string_comparison(stdString)
  .simulate();
```

<!-- markdownlint-enable md029 -->

Typegen attempts to resolve, auto-load, and embed the Storage Slots for your Contract within the `MyContract__factory` class. However, you can override this, along with other options, when calling the `deployContract` method:

```typescript
/* AFTER - v0.73.0 */
import storageSlots from "../contract/out/debug/storage-slots.json";

const contract = await MyContract__factory.deployContract(bytecode, wallet, {
  storageSlots,
});
```

`concat`, `arrayify`, and `hexlify` have been introduced to the utils to replace their respective functions from the ethers library, avoiding the reexporting of ethers functions.

```typescript
/* BEFORE - v0.60.0 */
import { concat, arrayify, hexlify } from "@ethersproject/bytes";

const someBytes = concat([
  new Uint8Array([1, 2, 3]),
  new Uint8Array([4, 5, 6]),
  new Uint8Array([7, 8, 9]),
]);
const someHex = hexlify(new Uint8Array([0, 1, 2, 3]));
const someArray = arrayify(new Uint8Array([0, 1, 2, 3]));

/* AFTER - v0.73.0 */
import { concat, arrayify, hexlify } from "@fuel-ts/utils";

const someBytes = concat([
  new Uint8Array([1, 2, 3]),
  new Uint8Array([4, 5, 6]),
  new Uint8Array([7, 8, 9]),
]);
const someHex = hexlify(new Uint8Array([0, 1, 2, 3]));
const someArray = arrayify(new Uint8Array([0, 1, 2, 3]));
```

`Address` types can no longer be used directly to represent a `b256` and must instead use the `toB256()` conversion method.

```typescript
/* BEFORE - v0.60.0 */
const addressId = {
  value: userWallet.address,
};

tokenContract.functions
  .transfer_coins_to_output(addressId, assetId, amount)
  .call();

/* AFTER - v0.73.0 */
const addressId = {
  value: userWallet.address.toB256(),
};

tokenContract.functions
  .transfer_coins_to_output(addressId, assetId, amount)
  .call();
```

The `Account` class's `fund()` method now takes in two new parameters: `quantities` and `fee`, of types `CoinQuantity[]` and `BN`, respectively. These can be derived from the provider's `getTransactionCost()` method.

```typescript
/* BEFORE - v0.60.0 */
await wallet.fund(transactionRequest);

/* AFTER - v0.73.0 */
const { maxFee, requiredQuantities } = await provider.getTransactionCost(
  transactionRequest
);

await wallet.fund(transactionRequest, quantities, fee);
```

The `provider`'s `getTransactionCost` now breaks down its old `fee` into `minFee`, `usedFee`, and `maxFee`, based on the actual calculation of the transaction. Additionally, `requiredQuantities`, `receipts`, `minGas`, and `maxGas`, of types `coinQuantity[]`, `TransactionResultReceipt[]`, `BN`, and `BN` respectively, have also been introduced to improve the granularity of cost estimation.

```typescript
/* BEFORE - v0.60.0 */
const { fee } = await this.account.provider.getTransactionCost(
  transactionRequest
);

/* AFTER - v0.73.0 */
const {
  requiredQuantities,
  receipts,
  minGas,
  maxGas,
  minFee,
  maxFee,
  usedFee,
} = await this.account.provider.getTransactionCost(transactionRequest);
```

The `getTransferOperations` function now takes in a `receipts` parameter as well, ensuring that contract transactions return the transfer asset.

```typescript
/* BEFORE - v0.60.0 */
const operations = getTransferOperations({ inputs: [], outputs: [] });

/* AFTER - v0.73.0 */
const operations = getTransferOperations({
  inputs: [],
  outputs: [],
  receipts: [],
});
```

The predicate introduces a new `getTransferTxId`, a method to calculate the transaction ID for a `Predicate.transfer` transaction.

```typescript
/* AFTER - v0.73.0 */
const txId = await predicate.getTransferTxId(address, amount, BaseAssetId, {
  gasPrice,
});
```

The `deployContract` method contains a new parameter, `storageSlotsPath`, to avoid issues that may arise if storage slots are not auto-loaded. Without auto-loading, some contracts will revert due to improper or missing initialization of storage slots.

```typescript
/* BEFORE - v0.60.0 */
const assetId = BaseAssetId;

/* AFTER - v0.73.0 */
const assetId: AssetId = { value: BaseAssetId };
```

`AssetId` has been introduced to match the Sway standard library as a `Struct` wrapper around an inner `Bits256` value.

### Rust SDK

Release: [Rust SDK v0.55.0](https://github.com/FuelLabs/fuels-rs/releases/tag/v0.55.0)

The `sign_message()` and `sign_transaction` functions in the `Signer` trait have been consolidated into a single method, now simply named `sign`.

```rust
/* BEFORE - v0.48.0 */
let signature1: B512 = wallet.sign_message(data_to_sign).await?.as_ref().try_into()?;

/* AFTER - v0.55.0 */
let signature1: B512 = wallet.sign(data_to_sign).await?.as_ref().try_into()?;
```

The function `check_without_signatures` in the `Transaction` trait has been renamed to `check`. This updated `check` function retains its original capabilities and now includes the additional feature of checking with signatures.

```rust
/* BEFORE - v0.48.0 */
tx.check_without_signatures(chain_info.latest_block.header.height, self.consensus_parameters())?;

/* AFTER - v0.55.0 */
tx.check(chain_info.latest_block.header.height, self.consensus_parameters())?;
```

The typo in the `add_witnessses` function name under the `Account` trait has been fixed and is now `add_witnesses`.

```rust
/* BEFORE - v0.48.0 */
account.add_witnessses(&mut tb);

/* AFTER - v0.55.0 */
account.add_witnesses(&mut tb)?;
```

Use of `Message`, `PublicKey`, `SecretKey` and `Signature` can be found inside `fuels::crypto::` now.

```rust
/* BEFORE - v0.48.0 */
use fuels::accounts::fuel_crypto::SecretKey;

/* AFTER - v0.55.0 */
use fuels::crypto::SecretKey,
```

The `submit_and_await_commit()` function now returns a `TxStatus` instead of a `TxId`.

```rust
/* BEFORE - v0.48.0 */
let tx_id = self.client.submit_and_await_commit(&tx.clone().into()).await?.into();

/* AFTER - v0.55.0 */
let tx_status = self.client.submit_and_await_commit(&tx.clone().into()).await?.into();
```

When constructing a transaction, the provider already possesses all the necessary information, rendering `NetworkInfo` and all its related functions and methods obsolete. Consequently, `ScriptTransactionBuilder::new`, `CreateTransactionBuilder::new`, and `Provider::new` have been removed for `::default()`.

```rust
/* BEFORE - v0.48.0 */
use fuels_core::types::transaction_builders::{DryRunner, NetworkInfo}

ScriptTransactionBuilder::new(network_info)

/* AFTER - v0.55.0 */
use fuels_core::types::transaction_builders::{DryRunner}

ScriptTransactionBuilder::default()
```

In Sway, `U256` has been deprecated in favor of `u256`. It is no longer supported in the SDK. Usage of `U256` will now result in a runtime error.

`TxPolicies` supersedes `TxParameters`.

```rust
/* BEFORE - v0.48.0 */
let tx_parameters = TxParameters::default()

/* AFTER - v0.55.0 */
let tx_policies = TxPolicies::default()
```

Three new optional fields have been introduced in `TxPolicies`:

1. `WitnessLimit`, which sets a new restriction for transaction witnesses by introducing a limit on the maximum byte size of witnesses in transactions.
2. `MaxFee`, which sets an upper limit on the transaction fee that a user is willing to pay.
3. `ScriptGasLimit`, which no longer constrains predicate execution time but exclusively limits the gas limit of scripts. If this field is not set, the SDK will estimate gas consumption and set it automatically.

Additionally, `GasPrice` and `Maturity` fields within `TxPolicies` are now optional parameters.

```rust
/* BEFORE - v0.48.0 */
let tx_parameters = TxParameters::new(gas_price, gas_limit, maturity)

/* AFTER - v0.55.0 */
let tx_policies = TxPolicies::new(Some(gas_price), Some(witness_limit), Some(maturity), Some(max_fee), Some(script_gas_limit))
```

`TxPolicy` Pitfalls

1. If the `max_fee` is greater than `policies.max_fee`, then the transaction will be rejected.
2. If the `witnesses_size` is greater than `policies.witness_limit`, then the transaction will be rejected.

The predicate's `get_message_proof` now uses `nonce` instead of `msg_id`.

```rust
/* BEFORE - v0.48.0 */
let proof = predicate.try_provider()?
  .get_message_proof(&tx_id, &msg_id, None, Some(2))

/* AFTER - v0.55.0 */
let proof = predicate.try_provider()?
  .get_message_proof(&tx_id, &msg_nonce, None, Some(2))
```

When using local chain configs, the `manual_blocks_enabled` option is replaced by the new `debug` flag. Additionally, with `local_node()` being deprecated in favor of `default()`, the options `utxo_validation` and `manual_blocks_enabled` are enabled by default for the test providers.

```rust
/* BEFORE - v0.48.0 */
let config = Config {
    utxo_validation: true,
    manual_blocks_enabled: true,
    ..Config::local_node()
};

/* AFTER - v0.55.0 */
let config = Config {
    ..Config::default()
};
```

When using `transaction_builders`, the `BuildableTransaction` trait must be in scope.

```rust
/* BEFORE - v0.48.0 */
use fuels_core::{
    types::{
        transaction_builders::{TransactionBuilder, ScriptTransactionBuilder},
    },
};

/* AFTER - v0.55.0 */
use fuels_core::{
    types::{
        transaction_builders::{BuildableTransaction, ScriptTransactionBuilder},
    },
};
```

## October 2, 2023

### TS SDK

Release: [TS SDK v0.60.0](https://github.com/FuelLabs/fuels-ts/releases/tag/v0.60.0)

`Provider` is used so widely in our SDK, there are multiple breaking changes that we need to be aware of and need to communicate to our users:

```typescript
/* BEFORE - v0.57.0 */
const provider = new Provider(url);

/* AFTER - v0.60.0 */
const provider = await Provider.create(url);
```

All of these methods now require a `Provider` to be passed in:

#### Wallet Methods

Some of these methods used to accept a URL instead of a `Provider` object. Note that the `provider` parameter _has_ to be a `Provider` object now.

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
const predicateInputs: TransactionRequestInput[] = predicateUtxos.map(
  (utxo) => ({
    id: utxo.id,
    type: InputType.Coin,
    amount: utxo.amount,
    assetId: utxo.assetId,
    owner: utxo.owner.toB256(),
    txPointer: "0x00000000000000000000000000000000",
    witnessIndex: 0,
    maturity: 0,
    predicate: predicate.bytes,
    predicateData: predicate.predicateData,
  })
);

/* AFTER - v0.57.0 */
request.addPredicateResources(
  predicateUtxos,
  predicate.bytes,
  predicate.predicateData
);
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

# Minted Token Asset ID

The asset ID of a token on the Fuel network is determined by two factors:

- The ID of the contract that minted the token,
- A sub-identifier (Sub ID)

> Both of which are [B256](../types/b256.md) strings.

The process involves applying a SHA-256 hash algorithm to the combination of the Contract ID and the Sub ID, to derive an Asset ID - as explained [here](https://docs.fuel.network/docs/specs/identifiers/asset/#asset-id).

Consider the following simplified token contract:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/token/src/main.sw' -->

Imagine that this contract is already deployed and we are about to mint some coins:

```ts\nimport { bn, getMintedAssetId, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { TokenFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await TokenFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

// Any valid B256 string can be used as a sub ID
const subID =
  '0xc7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745';
const mintAmount = bn(1000);

const { waitForResult } = await contract.functions
  .mint_coins(subID, mintAmount)
  .call();
await waitForResult();

// Get the minted
const mintedAssetId = getMintedAssetId(contract.id.toB256(), subID);\n```

## Obtaining the Asset ID

Since the asset ID depends on the contract ID, which is always dynamic (unlike the sub ID, which can be set to a fixed value), the helper `getMintedAssetId` can be used to easily obtain the asset ID for a given contract ID and sub ID.

## Create Asset Id

The SDK provides a helper named `createAssetId` which takes the contract ID and sub ID as parameters. This helper internally calls `getMintedAssetId` and returns the Sway native parameter [AssetId](DOCS_API_URL/types/_fuel_ts_address.AssetId.html), ready to be used in a Sway program invocation:

```ts\nimport type { AssetId, B256Address } from 'fuels';
import { createAssetId } from 'fuels';

const contractId: B256Address =
  '0x67eb6a384151a30e162c26d2f3e81ca2023dfa1041000210caed42ead32d63c0';
const subID: B256Address =
  '0xc7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745';

const assetId: AssetId = createAssetId(contractId, subID);
// {
//   bits: '0x16c1cb95e999d0c74806f97643af158e821a0063a0c8ea61183bad2497b57478'
// }\n```

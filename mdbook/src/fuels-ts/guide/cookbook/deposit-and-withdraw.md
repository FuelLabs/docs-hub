# Deposit And Withdraw

Consider the following contract:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/liquidity-pool/src/main.sw' -->

As the name implies, this contract represents a simplified version of a liquidity pool. The `deposit()` method allows you to supply an arbitrary amount of `BASE_TOKEN`. In response, it mints twice the amount of the liquidity asset to the caller's address. Similarly, the `withdraw()` method transfers half the amount of the `BASE_TOKEN` back to the caller's address.

Now, let's deposit some tokens into the liquidity pool contract. Since this requires forwarding assets to the contract, we need to pass the appropriate values to `callParams` when creating a contract call.

```ts\nimport { getMintedAssetId, Provider, Wallet, ZeroBytes32 } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { LiquidityPoolFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deploy = await LiquidityPoolFactory.deploy(wallet, {
  configurableConstants: {
    TOKEN: { bits: await provider.getBaseAssetId() },
  },
});

const { contract } = await deploy.waitForResult();

const depositAmount = 100_000;
const liquidityOwner = Wallet.generate({ provider });

// the subId used to mint the new asset is a zero b256 on the contract
const subId = ZeroBytes32;
const contractId = contract.id.toB256();

const assetId = getMintedAssetId(contractId, subId);

const { waitForResult } = await contract.functions
  .deposit({ bits: liquidityOwner.address.toB256() })
  .callParams({ forward: [depositAmount, await provider.getBaseAssetId()] })
  .txParams({ variableOutputs: 1 })
  .call();

await waitForResult();

const liquidityAmount = await liquidityOwner.getBalance(assetId);\n```

As a final demonstration, let's use all our liquidity asset balance to withdraw from the pool and confirm we retrieved the initial amount. For this, we get our liquidity asset balance and supply it to the `withdraw()` function via `callParams`.

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { LiquidityPoolFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deploy = await LiquidityPoolFactory.deploy(wallet, {
  configurableConstants: {
    TOKEN: { bits: await provider.getBaseAssetId() },
  },
});

const { contract } = await deploy.waitForResult();

const depositAmount = 100_000;
const liquidityOwner = Wallet.generate({ provider });

const { waitForResult } = await contract.functions
  .withdraw({ bits: liquidityOwner.address.toB256() })
  .callParams({ forward: [depositAmount, await provider.getBaseAssetId()] })
  .txParams({ variableOutputs: 1 })
  .call();

await waitForResult();

const baseAssetAfterWithdraw = await liquidityOwner.getBalance(
  await provider.getBaseAssetId()
);\n```

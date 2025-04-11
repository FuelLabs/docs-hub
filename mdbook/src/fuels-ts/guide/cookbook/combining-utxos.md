# Combining UTXOs

When performing a funding operation or calling `getResourcesToSpend`, you may encounter the `INSUFFICIENT_FUNDS_OR_MAX_COINS` error if the number of coins fetched per asset exceeds the maximum limit allowed by the chain.

You may also want to do this if you want to reduce the number of inputs in your transaction, which can be useful if you are trying to reduce the size of your transaction or you are receiving the `MAX_INPUTS_EXCEEDED` error.

One way to avoid these errors is to combine your UTXOs. This can be done by performing a transfer that combines multiple UTXOs into a single UTXO, where the transaction has multiple inputs for the asset, but a smaller number of outputs.

> **Note:** You will not be able to have a single UTXO for the base asset after combining, as one output will be for the transfer, and you will have another for the fees.

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);
const baseAssetId = await provider.getBaseAssetId();
const fundingWallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const wallet = Wallet.generate({ provider });

// First, lets fund a wallet with 10_000 of the base asset. But as we are doing this across 10 transactions,
// we will end up with 10 UTXOs.
for (let i = 0; i < 10; i++) {
  const initTx = await fundingWallet.transfer(
    wallet.address,
    1000,
    baseAssetId
  );
  await initTx.waitForResult();
}

// We can fetch the coins to see how many UTXOs we have, and confirm it is 10.
const { coins: initialCoins } = await wallet.getCoins(baseAssetId);
console.log('Initial Coins Length', initialCoins.length);
// 10

// But we can also confirm the total balance of the base asset for this account is 10_000.
const initialBalance = await wallet.getBalance(baseAssetId);
console.log('Initial Balance', initialBalance.toNumber());
// 10_000

// Now we can combine the UTXOs into a single UTXO by performing a single transfer for the
// majority of the balance. Of course, we will still need some funds for the transaction fees.
const combineTx = await wallet.transfer(wallet.address, 9500, baseAssetId);
await combineTx.wait();

// Now we can perform the same validations and see we have less UTXOs.
// We have 2 in this instance, as we have performed the transfer in the base asset:
// a UTXO for our transfer, and another for what is left after paying the fees.
const { coins: combinedCoins } = await wallet.getCoins(baseAssetId);
console.log('Combined Coins Length', combinedCoins.length);
// 2

// And we can also confirm the final balance of the base asset for this account is 9_998,
// so the cost of combining is also minimal.
const combinedBalance = await wallet.getBalance(baseAssetId);
console.log('Combined Balance', combinedBalance.toNumber());
// 9_998\n```

## Max Inputs and Outputs

It's also important to note that depending on the chain configuration, you may be limited on the number of inputs and/or outputs that you can have in a transaction. These amounts can be queried via the [TxParameters](https://docs.fuel.network/docs/graphql/reference/objects/#txparameters) GraphQL query.

```ts\nimport { Provider } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);

const { maxInputs, maxOutputs } = (await provider.getChain())
  .consensusParameters.txParameters;\n```

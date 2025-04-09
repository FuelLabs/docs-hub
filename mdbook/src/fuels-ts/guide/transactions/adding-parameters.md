# Adding Parameters

Transaction parameters allow you to configure various aspects of your blockchain transactions. Dependent on these parameters, it may introduce a [transaction policy](./adding-policies.md).

All available parameters are shown below:

```ts\nconst txParams: TxParams = {
  // #region transaction-parameters-1
  gasLimit: bn(70935),
  // #endregion transaction-parameters-1
  // #region transaction-parameters-2
  maxFee: bn(69242),
  // #endregion transaction-parameters-2
  // #region transaction-parameters-3
  tip: bn(100),
  // #endregion transaction-parameters-3
  // #region transaction-parameters-4
  maturity: 1,
  // #endregion transaction-parameters-4
  // #region transaction-parameters-5
  witnessLimit: bn(5000),
  // #endregion transaction-parameters-5
  // #region transaction-parameters-6
  expiration: 200,
  // #endregion transaction-parameters-6
};\n```

## Gas Limit

The maximum amount of gas you're willing to allow the transaction to consume. If the transaction requires more gas than this limit, it will fail.

```ts\ngasLimit: bn(70935),\n```

## Max Fee

The maximum amount you're willing to pay for the transaction using the base asset. This allows users to set an upper limit on the transaction fee they are willing to pay, preventing unexpected high costs due to sudden network congestion or fee spikes.

```ts\nmaxFee: bn(69242),\n```

## Tip

An optional amount of the base asset to incentivise the block producer to include the transaction, ensuring faster processing for those willing to pay more. The value set here will be added to the transaction `maxFee`.

```ts\ntip: bn(100),\n```

## Maturity

The number of blocks that must pass before the transaction can be included in a block. This is useful for time-sensitive transactions, such as those involving time-locked assets.

For example, if the chain produces a new block every second, setting Maturity to `10` means the transaction will be processed after approximately 10 seconds.

```ts\nmaturity: 1,\n```

## Witness Limit

The maximum byte length allowed for the transaction witnesses array. For instance, imagine a transaction that will deploy a contract. The contract bytecode will be one of the entries in the transaction witnesses. If you set this limit to `5000` and the contract bytecode length is `6000`, the transaction will be rejected because the witnesses bytes length exceeds the maximum value set.

```ts\nwitnessLimit: bn(5000),\n```

## Expiration

The block number after which the transaction can no longer be included in the blockchain. For example, if you set the expiration block for your transaction to 200, and the transaction remains in the queue waiting to be processed when block 200 is created, the transaction will be rejected.

```ts\nexpiration: 200,\n```

## Variable Outputs

The number of variable outputs that should be added to the transaction request. You can read more about it on this [guide](../contracts/variable-outputs.md)

> **Note**: Setting transaction parameters is optional. If you don't specify them, the SDK will fetch some sensible defaults from the chain.

## Setting Transaction Parameters

To set the transaction parameters, you have access to the `txParams` method on a transaction request.

```ts\nconst transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
  gasLimit: 100,
});\n```

The same method is also accessible within a function invocation scope, so it can also be used when calling contract functions.

```ts\nconst { waitForResult } = await contract.functions
  .increment_count(15) //
  .txParams(txParams)
  .call();

const {
  value,
  transactionResult: { isStatusSuccess },
} = await waitForResult();

console.log('Transaction request', transactionRequest);
console.log('Transaction status', isStatusSuccess);
console.log('Transaction value', value);\n```

> **Note:** When performing an action that results in a transaction (e.g. contract deployment, contract call with `.call()`, asset transfer), the SDK will automatically estimate the fee based on the gas limit and the transaction's byte size. This estimation is used when building the transaction. As a side effect, your wallet must own at least one coin of the base asset, regardless of the amount.

## Full Example

Here is the full example of the transaction parameters:

```ts\nimport type { TxParams } from 'fuels';
import { bn, Provider, ScriptTransactionRequest, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { CounterFactory } from '../../../typegend';
import { ScriptSum } from '../../../typegend/scripts';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deploy = await CounterFactory.deploy(wallet);

const { contract } = await deploy.waitForResult();

// #region transaction-parameters-7
const txParams: TxParams = {
  // #region transaction-parameters-1
  gasLimit: bn(70935),
  // #endregion transaction-parameters-1
  // #region transaction-parameters-2
  maxFee: bn(69242),
  // #endregion transaction-parameters-2
  // #region transaction-parameters-3
  tip: bn(100),
  // #endregion transaction-parameters-3
  // #region transaction-parameters-4
  maturity: 1,
  // #endregion transaction-parameters-4
  // #region transaction-parameters-5
  witnessLimit: bn(5000),
  // #endregion transaction-parameters-5
  // #region transaction-parameters-6
  expiration: 200,
  // #endregion transaction-parameters-6
};
// #endregion transaction-parameters-7

// #region transaction-parameters-8
const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
  gasLimit: 100,
});
// #endregion transaction-parameters-8

// #region transaction-parameters-9
const { waitForResult } = await contract.functions
  .increment_count(15) //
  .txParams(txParams)
  .call();

const {
  value,
  transactionResult: { isStatusSuccess },
} = await waitForResult();

console.log('Transaction request', transactionRequest);
console.log('Transaction status', isStatusSuccess);
console.log('Transaction value', value);

// #endregion transaction-parameters-9\n```

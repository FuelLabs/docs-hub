# Adding Policies

Transaction policies are rules that can govern how a transaction is processed, introduced by the [transaction parameters](./adding-parameters.md) that you pass to a transaction request. The available policies are as follows:

### Tip

Optional amount on the base asset to incentivise block producer to include transaction, ensuring faster processing for those willing to pay more. The value set here will be added to the transaction `maxFee`.

### Witness Limit

The maximum byte length allowed for the transaction witnesses array.

### Maturity

The number of blocks that must pass before the transaction can be included in a block.

### Max Fee

The maximum amount you're willing to pay for the transaction using the base asset.

### Expiration

Block number after which the transaction can no longer be included in the blockchain.

## Setting Transaction Policies

The following snippet shows which transaction parameters correspond to which policies:

```ts\nimport { bn, ScriptTransactionRequest } from 'fuels';

const transactionRequest = new ScriptTransactionRequest({
  tip: bn(10), // Sets the tip policy
  witnessLimit: bn(1), // Sets the witness limit policy
  maturity: 1, // Sets the maturity policy
  maxFee: bn(1), // Sets the max fee policy
  expiration: 200, // Sets the block after which the transaction cannot be included.
});\n```

## Retrieving Transaction Policies from a Transaction

Policies used for a transaction can be retrieved from a transaction using a `TransactionResponse`. The below snippet will show how to retrieve the policies from a transaction:

```ts\nimport type { Policy } from 'fuels';
import { Provider, Wallet, ScriptTransactionRequest, bn } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { ScriptSum } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

/**
 * Instantiate the transaction request with transaction parameters
 * that will set the respective policies.
 */
const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
  gasLimit: bn(2000),
  tip: bn(10),
  witnessLimit: 900,
  maxFee: bn(2000),
  expiration: 200,
});

// Set the script main function arguments
const scriptArguments = [1];
transactionRequest.setData(ScriptSum.abi, scriptArguments);

// Fund the transaction
const resources = await wallet.getResourcesToSpend([
  { amount: 1000, assetId: await provider.getBaseAssetId() },
]);

transactionRequest.addResources(resources);

// Submit the transaction and retrieve the transaction response
const tx = await wallet.sendTransaction(transactionRequest);
const response = await tx.waitForResult();
const policies: Policy[] | undefined = response.transaction.policies;

console.log('policies', policies);\n```

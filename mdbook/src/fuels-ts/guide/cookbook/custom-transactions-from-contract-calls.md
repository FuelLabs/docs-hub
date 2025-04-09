# Custom Transactions From Contract Calls

In the previous example we demonstrated how you can instantiate a [`ScriptTransactionRequest`](DOCS_API_URL/classes/_fuel_ts_account.ScriptTransactionRequest.html) to customize and build out a more complex transaction via a script. The same can be done using contracts, but this allows us to utilize functions available in the contract and access on-chain state. Allowing us to harness all of the power from an invocation scope and a transaction request.

This cookbook demonstrates how we can utilize a contract call to build out a custom transaction, allowing us to update on-chain state and transfer assets to a recipient address.

```ts\nimport { bn, buildFunctionResult, Contract, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { CounterFactory } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const baseAssetId = await provider.getBaseAssetId();

const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const deploy = await CounterFactory.deploy(wallet);
const { contract } = await deploy.waitForResult();

const receiverWallet = Wallet.generate({ provider });

const amountToRecipient = bn(10_000); // 0x2710
// Connect to the contract
const contractInstance = new Contract(contract.id, contract.interface, wallet);
// Create an invocation scope for the contract function you'd like to call in the transaction
const scope = contractInstance.functions
  .increment_count(amountToRecipient)
  .addTransfer({
    amount: amountToRecipient,
    destination: receiverWallet.address,
    assetId: baseAssetId,
  });

// Build a transaction request from the invocation scope
const transactionRequest = await scope.getTransactionRequest();
// Add coin output for the recipient
transactionRequest.addCoinOutput(
  receiverWallet.address,
  amountToRecipient,
  baseAssetId
);

// Estimate and fund the transaction
await transactionRequest.estimateAndFund(wallet);

// Submit the transaction
const response = await wallet.sendTransaction(transactionRequest);
await response.waitForResult();
// Get result of contract call
const { value } = await buildFunctionResult({
  funcScope: scope,
  isMultiCall: false,
  program: contract,
  transactionResponse: response,
});

console.log('value', value);
// <BN: 0x2710>\n```

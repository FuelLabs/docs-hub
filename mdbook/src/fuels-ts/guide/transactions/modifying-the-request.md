# Transaction Request

A transaction request provides the foundations for submitting a transaction and interacting with the blockchain.

Within Fuel, we have the following transaction types:

- Script
- Create
- Mint

The SDK provides class helpers for handling script and create transactions: `ScriptTransactionRequest` and `CreateTransactionRequest`, respectively.

> **Note**: Mint transactions can only be created by the block producer and do not have any use outside of block creation. Therefore, the SDK only provides the ability to decode them.

## Creating a Transaction Request

To create a transaction request, you must first instantiate either a `ScriptTransactionRequest` or `CreateTransactionRequest`.

A `ScriptTransactionRequest` is used for script transactions, which allows you to execute bytecode on chain to perform a task or chain of tasks. Within the SDK they can be created like so:

```ts\nimport {
  CreateTransactionRequest,
  ScriptTransactionRequest,
  ZeroBytes32,
} from 'fuels';

import { ScriptSum } from '../../../../typegend';

// Instantiate the transaction request using a ScriptTransactionRequest
const scriptTransactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

const scriptData = [1];

// Set the script main function arguments (can also be passed in the class constructor)
scriptTransactionRequest.setData(ScriptSum.abi, scriptData);\n```

A `CreateTransactionRequest` is used for create transactions, which are transactions that create a new contract on the blockchain.

```ts\n// Instantiate the transaction request using a CreateTransactionRequest
const createTransactionRequest = new CreateTransactionRequest({
  witnesses: [contractByteCode],
});\n```

> **Note**: We recommend you use the `ContractFactory` for contract deployment as this will shape the create transaction request for you. Information on this can be found in the [contract deployment guide](../contracts/deploying-contracts.md#2-contract-deployment).

## Modifying a Transaction Request

Once you have instantiated a transaction request, you can modify it by setting the transaction parameters and policies. This can either be done manually by directly altering the transaction request object, or through helper methods that are available on the above classes.

### Adding `OutputCoin`

Including `OutputCoin`s in the transaction request specifies the UTXOs that will be created once the transaction is processed. These UTXOs represent the amounts being transferred to specified account addresses during the transaction:

```ts\nconst provider = new Provider(LOCAL_NETWORK_URL);

const recipient1 = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const recipient2 = Wallet.fromPrivateKey(WALLET_PVT_KEY_2, provider);

const baseAssetId = await provider.getBaseAssetId();
const assetA = TestAssetId.A.value;

const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

transactionRequest.addCoinOutput(recipient1.address, 1000, baseAssetId);
transactionRequest.addCoinOutput(recipient2.address, 500, assetA);\n```

### Estimating and Funding the Transaction Request

Before submitting a transaction, it is essential to ensure it is properly funded to meet its requirements and cover the associated fee. The SDK offers two approaches for this, one is to use the `estimateAndFund` helper:

```ts\nconst transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

await transactionRequest.estimateAndFund(wallet);

await wallet.sendTransaction(transactionRequest);\n```

This approach provides a simple one-liner for estimating and funding the transaction request. Ensuring that the `gasLimit` and `maxFee` are accurately calculated and that the required amounts for `OutputCoin`s are fulfilled, as well as fetching and adding any missing resources from the calling account.

The other more manual approach is as so:

```ts\nconst transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

const cost = await wallet.getTransactionCost(transactionRequest);

transactionRequest.gasLimit = cost.gasUsed;
transactionRequest.maxFee = cost.maxFee;

await wallet.fund(transactionRequest, cost);

await wallet.sendTransaction(transactionRequest);\n```

This approach provides the same behaviour as the `estimateAndFund` helper, but gives more granular control over the transaction request. The `getTransactionCost` method also returns various information about the simulated request that you may want to use to further modify the transaction request, more on that can be found in the [API reference](DOCS_API_URL/types/_fuel_ts_account.TransactionCost.html).

### Manually Fetching Resources

In certain scenarios, you may need to manually fetch resources. This can be achieved using the `getResourcesToSpend` method, which accepts an array of `CoinQuantities` and returns the necessary resources to meet the specified amounts:

```ts\n// Instantiate the transaction request
const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

const baseAssetId = await provider.getBaseAssetId();
const assetA = TestAssetId.A.value;

// Define the quantities to fetch
const quantities: CoinQuantity[] = [
  {
    amount: bn(10000),
    assetId: baseAssetId,
  },
  {
    amount: bn(100),
    assetId: assetA,
  },
];

// Fetching resources
const resources = await wallet.getResourcesToSpend(quantities);

// Adding resources (coins or messages)
transactionRequest.addResources(resources);\n```

#### Manually Fetching Coins or Messages

If needed, you can manually include specific coins or messages in the transaction. However, this approach is generally discouraged and should only be used in scenarios where explicitly adding particular coins or messages to the transaction request is required:

```ts\n// Fetching coins
const { coins } = await wallet.getCoins(baseAssetId);
const { messages } = await wallet.getMessages();

// Adding a specific coin or message
transactionRequest.addCoinInput(coins[0]);
transactionRequest.addMessageInput(messages[0]);\n```

### Adding a Contract Input and Output to a Transaction Request

Imagine that you have a Sway script that manually calls a contract:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/script-call-contract/src/main.sw' -->

In those cases, you will need to add both an `InputContract` and `OutputContract` to the transaction request:

```ts\nconst deploy = await CounterFactory.deploy(wallet);
const { contract } = await deploy.waitForResult();

const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
  scriptData: contract.id.toB256(),
});

// Add the contract input and output using the contract ID
transactionRequest.addContractInputAndOutput(contract.id);\n```

### Adding a Predicate to a Transaction Request

Predicates are used to define the conditions under which a transaction can be executed. Therefore you may want to add a predicate to a transaction request to unlock funds that are utilized by a script. This can be added like so:

```ts\n// Instantiate the transaction request
const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

const predicateArguments = [ZeroBytes32];

/**
 * Instantiate the predicate and pass valid input data to validate
 * the predicate and unlock the funds
 */
const predicate = new Predicate({
  bytecode: SimplePredicate.bytecode,
  abi: SimplePredicate.abi,
  data: predicateArguments,
  provider,
});

// Fund the predicate
const tx = await wallet.transfer(predicate.address, bn(100_000));
await tx.waitForResult();

const predicateCoins = await predicate.getResourcesToSpend([
  { amount: 2000, assetId: await provider.getBaseAssetId() },
]);

// Add the predicate input and resources
transactionRequest.addResources(predicateCoins);\n```

> **Note**: For more information on predicates, including information on configuring them, funding them and using them to unlock funds, please refer to the [predicate guide](../predicates/index.md).

### Adding a Witness and Signing a Transaction Request

The SDK provides a way of either modifying the witnesses for a transaction request directly, or by passing accounts. This will then sign the transaction request with the account's private key. Below will detail how to add a witness to a transaction request:

```ts\nconst provider = new Provider(LOCAL_NETWORK_URL);
const accountA = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const accountB = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const transactionRequest = new ScriptTransactionRequest({
  script: ScriptSum.bytecode,
});

// Add a witness directly
// Add a witness signature directly
const signature = await accountA.signTransaction(transactionRequest);
transactionRequest.addWitness(signature);

// Or add multiple via `addAccountWitnesses`
await transactionRequest.addAccountWitnesses([accountB]);\n```

A more complex example of adding multiple witnesses to a transaction request can be seen in the multiple signers guide [here](../cookbook/transactions-with-multiple-signers.md), which validates the signatures inside the script itself.

> **Note**: Once `addAccountWitnesses` has been called, any additional modifications to the transaction request will invalidate the signature as the transaction ID changes. Therefore, it is recommended to add witnesses last.

### Getting the Transaction ID for a Transaction Request

The transaction ID is a SHA-256 hash of the entire transaction request. This can be useful for tracking the transaction on chain. To get the transaction ID, you can use the following method:

```ts\n// Get the chain ID
const chainId = await provider.getChainId();

// Get the transaction ID using the Chain ID
const transactionId = transactionRequest.getTransactionId(chainId);
// TX ID: 0x420f6...\n```

> **Note**: Any changes made to a transaction request will alter the transaction ID. Therefore, you should only get the transaction ID after all modifications have been made.

### Burning assets

Assets can be burnt as part of a transaction that has inputs without associated output change. The SDK validates against this behavior, so we need to explicitly enable this by sending the transaction with the `enableAssetBurn` option set to `true`.

```ts\nconst transactionRequest = new ScriptTransactionRequest();

const {
  coins: [coin],
} = await sender.getCoins(ASSET_A);

// Add the coin as an input, without a change output
transactionRequest.inputs.push({
  id: coin.id,
  type: InputType.Coin,
  owner: coin.owner.toB256(),
  amount: coin.amount,
  assetId: coin.assetId,
  txPointer: '0x00000000000000000000000000000000',
  witnessIndex:
    transactionRequest.getCoinInputWitnessIndexByOwner(coin.owner) ??
    transactionRequest.addEmptyWitness(),
});

// Fund the transaction
await transactionRequest.estimateAndFund(sender);

// Send the transaction with asset burn enabled
const tx = await sender.sendTransaction(transactionRequest, {
  enableAssetBurn: true,
});\n```

> **Note**: Burning assets is permanent and all assets burnt will be lost. Therefore, be mindful of the usage of this functionality.

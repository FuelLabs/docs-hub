# Interacting With Contracts

There are 4 ways to interact with contracts: `get`, `dryRun`, `simulate`, `call`.

## `get`

The `get` method should be used to read data from the blockchain without using resources. It can be used with an unfunded wallet or even without a wallet at all:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await CounterFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

// Read from the blockchain
const { value } = await contract.functions.get_count().get();
// 0\n```

## `dryRun`

The `dryRun` method should be used to dry-run a contract call. It does not spend resources and can be used with an unfunded wallet or even without a wallet at all:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await CounterFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

// Perform a dry-run of the transaction
const { value } = await contract.functions.increment_count(1).dryRun();\n```

## `simulate`

The `simulate` method should be used to dry-run a contract call, ensuring that the wallet used has sufficient funds to cover the transaction fees, without consuming any resources.

A funded wallet it's required:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await CounterFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

// Simulate the transaction
const { value } = await contract.functions.increment_count(10).simulate();\n```

## `call`

The `call` method submits a real contract call transaction to the node, resolving immediately upon submission and returning a `transactionId` along with a `waitForResult` callback to wait for transaction execution. This behavior aligns with the natural behaviour of blockchains, where transactions may take a few seconds before being recorded on the chain.

Real resources are consumed, and any operations executed by the contract function will be processed on the blockchain.

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await CounterFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

// Perform the transaction
const { waitForResult } = await contract.functions.increment_count(10).call();

const { value } = await waitForResult();\n```

## `isReadOnly` (utility)

If you want to figure out whether a function is read-only, you can use the `isReadOnly` method:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await CounterFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

const isReadOnly = contract.functions.get_count.isReadOnly();

if (isReadOnly) {
  await contract.functions.get_count().get();
} else {
  const { waitForResult } = await contract.functions.get_count().call();
  await waitForResult();
}\n```

If the function is read-only, you can use the `get` method to retrieve onchain data without spending gas.

If the function is not read-only you will have to use the `call` method to submit a transaction onchain which incurs a gas fee.

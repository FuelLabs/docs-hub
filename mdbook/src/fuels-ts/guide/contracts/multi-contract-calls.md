# Multiple Contract Calls

<!-- This section should explain making multiple contract calls -->
<!-- calls:example:start -->

You can execute multiple contract calls in a single transaction, either to the same contract or to different contracts. This can improve efficiency and reduce the overall transaction costs.

<!-- calls:example:end -->

## Same Contract Multi Calls

<!-- This section should explain how make multiple calls with the SDK -->
<!-- multicall:example:start -->

Use the `multiCall` method to call multiple functions on the same contract in a single transaction:

<!-- multicall:example:end -->

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const counterContractTx = await CounterFactory.deploy(deployer);
const { contract: counterContract } = await counterContractTx.waitForResult();

const { waitForResult } = await counterContract
  .multiCall([
    counterContract.functions.get_count(),
    counterContract.functions.increment_count(2),
    counterContract.functions.increment_count(4),
  ])
  .call();

const { value: results } = await waitForResult();
// results[0] == 0
// results[1] == 2
// results[2] == 6\n```

## Different Contracts Multi Calls

The `multiCall` method also allows you to execute multiple contract calls to distinct contracts within a single transaction:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory, EchoValuesFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const counterContractTx = await CounterFactory.deploy(deployer);
const { contract: counterContract } = await counterContractTx.waitForResult();
const echoContractTx = await EchoValuesFactory.deploy(deployer);
const { contract: echoContract } = await echoContractTx.waitForResult();

const { waitForResult } = await echoContract
  .multiCall([
    echoContract.functions.echo_u8(17),
    counterContract.functions.get_count(),
    counterContract.functions.increment_count(5),
  ])
  .call();

const { value: results } = await waitForResult();
// results[0] == 17
// results[1] == BN <0>
// results[2] == BN <5>\n```

You can also chain supported contract call methods, like `callParams`, for each contract call:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { EchoValuesFactory, ReturnContextFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const echoContractTx = await EchoValuesFactory.deploy(deployer);
const { contract: echoContract } = await echoContractTx.waitForResult();
const returnContextTx = await ReturnContextFactory.deploy(deployer);
const { contract: returnContextContract } =
  await returnContextTx.waitForResult();

const { waitForResult } = await echoContract
  .multiCall([
    echoContract.functions.echo_u8(10),
    returnContextContract.functions.return_context_amount().callParams({
      forward: [100, await provider.getBaseAssetId()],
    }),
  ])
  .call();

const { value: results } = await waitForResult();
// results[0] == 10
// results[1] == BN <100>\n```

When using `multiCall`, the contract calls are queued and executed only after invoking one of the following methods: `.get`, `.simulate`, or `.call`.

## Using `multiCall` for Read-Only Contract Calls

When you need to read data from multiple contracts, the `multiCall` method can perform multiple [read-only](./methods.md#get) calls in a single transaction. This minimizes the number of requests sent to the network and consolidates data retrieval, making your dApp interactions more efficient.

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { CounterFactory, EchoValuesFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const counterContractTx = await CounterFactory.deploy(deployer);
const { contract: counterContract } = await counterContractTx.waitForResult();
const echoContractTx = await EchoValuesFactory.deploy(deployer);
const { contract: echoContract } = await echoContractTx.waitForResult();

const { waitForResult } = await echoContract
  .multiCall([
    counterContract.functions.get_count(),
    echoContract.functions.echo_u8(10),
    echoContract.functions.echo_str('Fuel'),
  ])
  .call();

const { value: results } = await waitForResult();
// results[0] == BN <0>
// results[1] == 10
// results[2] == 'Fuel'\n```

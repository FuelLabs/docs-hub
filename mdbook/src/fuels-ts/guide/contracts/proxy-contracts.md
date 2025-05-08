# Proxy Contracts

Automatic deployment of proxy contracts can be enabled in `Forc.toml`.

We recommend that you use [fuels deploy](https://docs.fuel.network/docs/fuels-ts/fuels-cli/commands/#fuels-deploy) to deploy and upgrade your contract using a proxy as it will take care of everything for you. However, if you want to deploy a proxy contract manually, you can follow the guide below.

## Manually Deploying and Upgrading by Proxy

As mentioned above, we recommend using [fuels deploy](https://docs.fuel.network/docs/fuels-ts/fuels-cli/commands/#fuels-deploy) to deploy and upgrade your contract because it will handle everything automatically. However, the guide below will explain this process in detail if you want to implement it yourself.

We recommend using the [SRC14 compliant owned proxy contract](https://github.com/FuelLabs/sway-standard-implementations/tree/174f5ed9c79c23a6aaf5db906fe27ecdb29c22eb/src14/owned_proxy/contract/out/release) as the underlying proxy as that is the one we will use in this guide and the one used by [fuels deploy](https://docs.fuel.network/docs/fuels-ts/fuels-cli/commands/#fuels-deploy). A TypeScript implementation of this proxy is exported from the `fuels` package as `Src14OwnedProxy` and `Src14OwnedProxyFactory`.

The overall process is as follows:

1. Deploy your contract
1. Deploy the proxy contract
1. Set the target of the proxy contract to your deployed contract
1. Make calls to the contract via the proxy contract ID
1. Upgrade the contract by deploying a new version of the contract and updating the target of the proxy contract

> **Note**: When new storage slots are added to the contract, they must be initialized in the proxy contract before they can be read from. This can be done by first writing to the new storage slot in the proxy contract. Failure to do so will result in the transaction being reverted.

For example, lets imagine we want to deploy the following counter contract:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/counter/src/main.sw' -->

Let's deploy and interact with it by proxy. First let's setup the environment and deploy the counter contract:

```ts\nimport {
  Provider,
  Wallet,
  Src14OwnedProxy,
  Src14OwnedProxyFactory,
} from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import {
  Counter,
  CounterFactory,
  CounterV2,
  CounterV2Factory,
} from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const counterContractFactory = new CounterFactory(wallet);
const deploy = await counterContractFactory.deploy();
const { contract: counterContract } = await deploy.waitForResult();\n```

Now let's deploy the [SRC14 compliant proxy contract](https://github.com/FuelLabs/sway-standard-implementations/tree/174f5ed9c79c23a6aaf5db906fe27ecdb29c22eb/src14/owned_proxy/contract/out/release) and initialize it by setting its target to the counter target ID.

```ts\n/**
 * It is important to pass all storage slots to the proxy in order to
 * initialize the storage slots.
 */
const storageSlots = counterContractFactory.storageSlots.concat(
  Src14OwnedProxy.storageSlots
);
/**
 * These configurables are specific to our recommended SRC14 compliant
 * contract. They must be passed on deployment and then `initialize_proxy`
 * must be called to setup the proxy contract.
 */
const configurableConstants = {
  INITIAL_TARGET: { bits: counterContract.id.toB256() },
  INITIAL_OWNER: {
    Initialized: { Address: { bits: wallet.address.toB256() } },
  },
};

const proxyContractFactory = new Src14OwnedProxyFactory(wallet);
const proxyDeploy = await proxyContractFactory.deploy({
  storageSlots,
  configurableConstants,
});

const { contract: proxyContract } = await proxyDeploy.waitForResult();
const { waitForResult } = await proxyContract.functions
  .initialize_proxy()
  .call();

await waitForResult();\n```

Finally, we can call our counter contract using the contract ID of the proxy.

```ts\n/**
 * Make sure to use only the contract ID of the proxy when instantiating
 * the contract as this will remain static even with future upgrades.
 */
const proxiedContract = new Counter(proxyContract.id, wallet);

const incrementCall = await proxiedContract.functions.increment_count(1).call();
await incrementCall.waitForResult();

const { value: count } = await proxiedContract.functions.get_count().get();\n```

Now let's make some changes to our initial counter contract by adding an additional storage slot to track the number of increments and a new get method that retrieves its value:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/counter-v2/src/main.sw' -->

We can deploy it and update the target of the proxy like so:

```ts\nconst deployV2 = await CounterV2Factory.deploy(wallet);
const { contract: contractV2 } = await deployV2.waitForResult();

const updateTargetCall = await proxyContract.functions
  .set_proxy_target({ bits: contractV2.id.toB256() })
  .call();

await updateTargetCall.waitForResult();\n```

Then, we can instantiate our upgraded contract via the same proxy contract ID:

```ts\n/**
 * Again, we are instantiating the contract with the same proxy ID
 * but using a new contract instance.
 */
const upgradedContract = new CounterV2(proxyContract.id, wallet);

const incrementCall2 = await upgradedContract.functions
  .increment_count(1)
  .call();

await incrementCall2.waitForResult();

const { value: increments } = await upgradedContract.functions
  .get_increments()
  .get();

const { value: count2 } = await upgradedContract.functions.get_count().get();\n```

For more info, please check these docs:

- [Proxy Contracts](https://docs.fuel.network/docs/forc/plugins/forc_client/#proxy-contracts)
- [Sway Libs / Upgradability Library](https://docs.fuel.network/docs/sway-libs/upgradability/#upgradability-library)
- [Sway Standards / SRC-14 - Simple Upgradable Proxies](https://docs.fuel.network/docs/sway-standards/src-14-simple-upgradeable-proxies/#src-14-simple-upgradeable-proxies)

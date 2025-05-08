# Transferring assets

Consider a scenario where you're interacting with a smart contract and need to transfer assets to a recipient's wallet. The `addTransfer` enables you to combine these actions into a single transaction seamlessly.

The `addTransfer` method allows you to append an asset transfer to your contract call transaction. You can use it is shown in the following example:

```ts\nimport { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { EchoValuesFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await EchoValuesFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

const recipient = Wallet.generate({ provider });

const { waitForResult } = await contract.functions
  .echo_u64(100)
  .addTransfer({
    destination: recipient.address,
    amount: 100,
    assetId: await provider.getBaseAssetId(),
  })
  .call();

await waitForResult();\n```

In the previous example, we first use a contract call to the `echo_u64` function. Following this, `addTransfer` is added to chain call to include a transfer of `100` units of the `BaseAssetId` in the transaction.

## Batch Transfer

You can add a batch of transfers into a single transaction by using `addBatchTransfer`:

```ts\nimport type { TransferParams } from 'fuels';
import { Provider, Wallet } from 'fuels';
import { ASSET_A, ASSET_B } from 'fuels/test-utils';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { EchoValuesFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await EchoValuesFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

const recipient1 = Wallet.generate({ provider });
const recipient2 = Wallet.generate({ provider });

const transferParams: TransferParams[] = [
  {
    destination: recipient1.address,
    amount: 100,
    assetId: await provider.getBaseAssetId(),
  },
  { destination: recipient1.address, amount: 400, assetId: ASSET_A },
  { destination: recipient2.address, amount: 300, assetId: ASSET_B },
];

const { waitForResult } = await contract.functions
  .echo_u64(100)
  .addBatchTransfer(transferParams)
  .call();

await waitForResult();\n```

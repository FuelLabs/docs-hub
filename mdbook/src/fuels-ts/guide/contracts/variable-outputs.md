# Variable Outputs

Sway includes robust functions for transferring assets to wallets and contracts.

When using these transfer functions within your Sway projects, it is important to be aware that each call will require an [Output Variable](https://docs.fuel.network/docs/specs/tx-format/output#outputvariable) within the [Outputs](https://docs.fuel.network/docs/specs/tx-format/output) of the transaction.

For instance, if a contract function calls a Sway transfer function 3 times, it will require 3 Output Variables present within the list of outputs in your transaction.

## Example: Sway functions that requires `Output Variable`

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/token/src/main.sw' -->

## Adding Variable Outputs to the contract call

When your contract invokes any of these functions, or if it calls a function that leads to another contract invoking these functions, you need to add the appropriate number of Output Variables.

This can be done as shown in the following example:

```ts\nimport { Provider, Wallet, getMintedAssetId, getRandomB256 } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../../env';
import { TokenFactory } from '../../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const deployer = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

const deployContract = await TokenFactory.deploy(deployer);
const { contract } = await deployContract.waitForResult();

const subId = getRandomB256();

const call1 = await contract.functions.mint_coins(subId, 100).call();
await call1.waitForResult();

const address = { bits: Wallet.generate().address.toB256() };
const assetId = { bits: getMintedAssetId(contract.id.toB256(), subId) };

const { waitForResult } = await contract.functions
  .transfer_to_address(address, assetId, 100)
  .txParams({
    variableOutputs: 1,
  })
  .call();

await waitForResult();\n```

In the TypeScript SDK, the Output Variables are automatically added to the transaction's list of outputs.

This process is done by a brute-force strategy, performing sequential dry runs until no errors are returned. This method identifies the number of Output Variables required to process the transaction.

However, this can significantly delay the transaction processing. Therefore, it is **highly recommended** to manually add the correct number of Output Variables before submitting the transaction.

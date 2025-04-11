# Contract Balance

When working with contracts, it's crucial to be aware of the available contract balance of an asset while paying for costly operations. This guide will explain the `getBalance` method in the [Contract](DOCS_API_URL/classes/_fuel_ts_program.Contract.html) class, which allows you to check a contract's available balance.

## The `getBalance` Method

The [`Contract.getBalance`](DOCS_API_URL/classes/_fuel_ts_program.Contract.html#getBalance) method retrieves the available balance of a specific asset on your contract. This method is particularly useful for determining the remaining balance after sending assets to a contract and executing contract calls.

It is important to note that this method returns the total available contract balance, regardless of how often assets have been sent to it or spent.

## Checking Contract Balance

Consider a simple contract that transfers a specified amount of a given asset to an address:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/transfer-to-address/src/main.sw' -->

The `transfer` function has three parameters:

1. `amount_to_transfer`: The amount that is being transferred.

2. `asset`: The address of the deployed contract token.

3. `recipient`: The address of the receiver's wallet.

The `transfer` function calls the built-in Sway function `transfer_to_address`, which does precisely what the name suggests.

Let's execute this contract and use the `getBalance` method to validate the remaining asset amount the contract has left to spend.

```ts\nimport type { AssetId } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';
import { TransferToAddressFactory } from '../../../typegend';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);
const { waitForResult: waitForDeploy } =
  await TransferToAddressFactory.deploy(wallet);
const { contract } = await waitForDeploy();

const amountToForward = 40;
const amountToTransfer = 10;
const baseAssetId = await provider.getBaseAssetId();

const recipient = Wallet.generate({
  provider,
});

const asset: AssetId = {
  bits: baseAssetId,
};

const { waitForResult } = await contract.functions
  .transfer(amountToTransfer, asset, recipient.address.toB256())
  .callParams({
    forward: [amountToForward, baseAssetId],
  })
  .call();

await waitForResult();

const contractBalance = await contract.getBalance(baseAssetId);
console.log(
  'contract balance reduced by amountToTransfer',
  contractBalance.toNumber() === amountToForward - amountToTransfer
);\n```

In this example, we first forward an asset amount greater than the amount required for the transfer, and then we execute the contract call.

Finally, we use the `getBalance` method to confirm that the contract balance is precisely the total forwarded amount minus the transferred amount.

# Call Parameters

<!-- This section should explain call params -->
<!-- call_params:example:start -->

When interacting with contracts, you can configure specific parameters for contract calls using the `callParams` method. The available call parameters are:

1. `forward`
2. `gasLimit`
<!-- call_params:example:end -->

> **Note**: Setting transaction parameters is also available when calling contracts. More information on this can be found at [Transaction Parameters](../transactions/adding-parameters.md).

The contract in use in this section has the following implementation:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/return-context/src/main.sw' -->

## Forward Parameter

<!-- This section should explain the `forward` param -->
<!-- forward:example:start -->

The `forward` parameter allows the sending of a specific amount of coins to a contract when a function is called. This is useful when a contract function requires coins for its execution, such as paying fees or transferring funds. The forward parameter helps you control the resources allocated to the contract call and offers protection against potentially costly operations.

<!-- forward:example:end -->

```ts\nconst amountToForward = 10;

const { waitForResult } = await contract.functions
  .return_context_amount()
  .callParams({
    forward: [amountToForward, await provider.getBaseAssetId()],
  })
  .call();

const { value } = await waitForResult();

console.log('forwarded amount:', value.toNumber());
// forwarded amount: 10\n```

## Gas Limit Parameter

<!-- This section should explain the `gasLimit` param -->
<!-- gas_limit:example:start -->

The `gasLimit` refers to the maximum amount of gas that can be consumed specifically by the contract call itself, separate from the rest of the transaction.

<!-- gas_limit:example:end -->

```ts\ntry {
  await contract.functions
    .return_context_amount()
    .callParams({
      forward: [10, await provider.getBaseAssetId()],
      gasLimit: 1,
    })
    .call();
} catch (e) {
  console.log('error', e);
  // error _FuelError: The transaction reverted with reason: "OutOfGas"
}\n```

## Call Parameter `gasLimit` vs Transaction Parameter `gasLimit`

The call parameter `gasLimit` sets the maximum gas allowed for the actual contract call, whereas the transaction parameter `gasLimit` _(see [Transaction Parameters](../transactions/adding-parameters.md))_ sets the maximum gas allowed for the entire transaction and constrains the `gasLimit` call parameter. If the call parameter `gasLimit` is set to a value greater than the _available_ transaction gas, then the entire available transaction gas will be allocated for the contract call execution.

If you don't set the `gasLimit` for the call, the transaction `gasLimit` will be applied.

## Setting Both Parameters

You can set both call parameters and transaction parameters within the same contract function call.

```ts\nconst contractCallGasLimit = 4_000;
const transactionGasLimit = 100_000;

const call = await contract.functions
  .return_context_amount()
  .callParams({
    forward: [10, await provider.getBaseAssetId()],
    gasLimit: contractCallGasLimit,
  })
  .txParams({
    gasLimit: transactionGasLimit,
  })
  .call();\n```

# Estimating Contract Call Cost

The [`FunctionInvocationScope.getTransactionCost`](DOCS_API_URL/classes/_fuel_ts_program.FunctionInvocationScope.html#getTransactionCost) method allows you to estimate the cost of a specific contract call. The return type, `TransactionCost`, is an object containing relevant information for the estimation:

<!-- SNIPPET FILE ERROR: File not found '../../../packages/account/src/providers/provider.ts' -->

The following example demonstrates how to get the estimated transaction cost for:

## 1. Single contract call transaction:

```ts\nconst cost = await contract.functions
  .return_context_amount()
  .callParams({
    forward: [100, baseAssetId],
  })
  .getTransactionCost();

console.log('costs', cost);\n```

## 2. Multiple contract calls transaction:

```ts\nconst scope = contract.multiCall([
  contract.functions.return_context_amount().callParams({
    forward: [100, baseAssetId],
  }),
  contract.functions.return_context_amount().callParams({
    forward: [300, baseAssetId],
  }),
]);

const txCost = await scope.getTransactionCost();

console.log('costs', txCost);\n```

You can use the transaction cost estimation to set the gas limit for an actual call or display the estimated cost to the user.

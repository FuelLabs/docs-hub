# Optimizing Frontend Apps

Your application must perform a series of operations to estimate, submit and receive the result of a transaction. However, the flow in which it performs these actions can be organized or performed optimistically, increasing it's perceived speed.

## Use Case

In a frontend application, imagine we have a button that executes a contract call:

```tsx
<Button onClick={handleSubmit}>Submit</Button>
```

The handler would be implemented as follows:

```ts\nasync function handleSubmit() {
  // 1. Calling the `call` function for a contract method will create
  // a transaction request, estimate it, fund it and then submit it
  const transaction = await contract.functions.increment_count(1).call();
  info(`Transaction ID Submitted: ${transaction.transactionId}`);

  // 2. Calling `waitForResult` will wait for the transaction to
  // settle, then assemble and return it
  const result = await transaction.waitForResult();
  info(`Transaction ID Successful: ${result.transactionId}`);
}\n```

Once the user clicks the button, multiple sequential calls are made to the network, which can take a while because the transaction must be:

1. Estimated
1. Funded
1. Submitted

## Optimization Strategy

With a few optimizations, the flow can be organized as follows:

```ts\n/**
 * Here we'll prepare our transaction upfront on page load, so that
 * by the time the user interacts with your app (i.e. clicking a btn),
 * the transaction is ready to be submitted
 */
async function onPageLoad() {
  // 1. Invoke the contract function whilst estimating and funding the
  // call, which gives us the transaction request
  request = await contract.functions.increment_count(1).fundWithRequiredCoins();
}

/**
 * By the time user user clicks the submit button, we only need to
 * submit the transaction to the network
 */
async function handleSubmit() {
  // 1. Submit the transaction to the network
  info(`Transaction ID Submitted: ${request.getTransactionId(chainId)}`);
  const response = await wallet.sendTransaction(request);

  // 2. Wait for the transaction to settle and get the result
  const result = await response.waitForResult();
  info(`Transaction ID Successful: ${result.id}`);
}\n```

## Conclusion

Finally, when users click the button, they only need to submit the transaction, which vastly improves the perceived speed of the transaction because many of the necessary requests were done upfront, under the hood.

Just remember:

- _After preparation, any changes made to the transaction request will require it to be re-estimated and re-funded before it can be signed and submitted._

# See Also

- Check a full example at [Optimized React Example](../cookbook/optimized-react-example.md)

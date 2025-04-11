# Setting up test wallets

You'll often want to create one or more test wallets when testing your contracts. Here's how to do it.

## Create a single wallet

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/wallets/snippets/access.ts' -->

## Setting up multiple test wallets

You can set up multiple test wallets using the `launchTestNode` utility via the `walletsConfigs` option.

To understand the different configurations, check out the [walletsConfig](./test-node-options.md#walletsconfig) in the test node options guide.

```ts\nusing launched = await launchTestNode({
  walletsConfig: {
    count: 3,
    assets: [TestAssetId.A, TestAssetId.B],
    coinsPerAsset: 5,
    amountPerCoin: 100_000,
  },
});

const {
  wallets: [wallet1, wallet2, wallet3],
} = launched;\n```

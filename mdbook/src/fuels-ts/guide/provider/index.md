# Provider

The [`Provider`](DOCS_API_URL/classes/_fuel_ts_account.Provider.html) lets you connect to a Fuel node ([_*docs*_](../getting-started/connecting-to-the-network.md)) and interact with it, encapsulating common client operations in the SDK. Those operations include querying the blockchain for network, block, and transaction-related info (and [more](DOCS_API_URL/classes/_fuel_ts_account.Provider.html)), as well as sending [transactions](../transactions/index.md) to the blockchain.

All higher-level abstractions (e.g. [`Wallet`](../wallets/index.md), [`Contract`](../contracts/index.md)) that interact with the blockchain go through the `Provider`, so it's used for various actions like getting a wallet's balance, deploying contracts, querying their state, etc.

```ts\nimport { Provider, WalletUnlocked } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

// Create the provider
const provider = new Provider(LOCAL_NETWORK_URL);

// Querying the blockchain
const { consensusParameters } = await provider.getChain();

// Create a new wallet
const wallet = WalletUnlocked.generate({ provider });

// Get the balances of the wallet (this will be empty until we have assets)
const { balances } = await wallet.getBalances();
// []\n```

You can find more examples of `Provider` usage [here](./querying-the-chain.md).

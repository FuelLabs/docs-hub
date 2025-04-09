# Checking balances

To check the balance of a specific asset, you can use [`getBalance`](DOCS_API_URL/classes/_fuel_ts_account.Account.html#getBalance) method. This function aggregates the amounts of all unspent coins of the given asset in your wallet.

```ts\nimport type { BN } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL, WALLET_PVT_KEY } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);

const myWallet = Wallet.fromPrivateKey(WALLET_PVT_KEY, provider);

// The returned amount is a BigNumber
const balance: BN = await myWallet.getBalance(await provider.getBaseAssetId());\n```

To retrieve the balances of all assets in your wallet, use the [`getBalances`](DOCS_API_URL/classes/_fuel_ts_account.Account.html#getBalances) method, it returns an array of [`CoinQuantity`](DOCS_API_URL/types/_fuel_ts_account.CoinQuantity.html). This is useful for getting a comprehensive view of your holdings.

```ts\nimport { Provider, Wallet } from 'fuels';

import { WALLET_PVT_KEY_2, LOCAL_NETWORK_URL } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);
const myOtherWallet = Wallet.fromPrivateKey(WALLET_PVT_KEY_2, provider);

const { balances } = await myOtherWallet.getBalances();\n```

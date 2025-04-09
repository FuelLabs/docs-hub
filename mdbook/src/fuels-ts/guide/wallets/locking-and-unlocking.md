# Locking and Unlocking

The kinds of operations we can perform with a [`Wallet`](DOCS_API_URL/classes/_fuel_ts_account.Wallet.html) instance depend on
whether or not we have access to the wallet's private key.

In order to differentiate between [`Wallet`](DOCS_API_URL/classes/_fuel_ts_account.Wallet.html) instances that know their private key
and those that do not, we use the [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) and [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) types
respectively.

## Wallet States

The [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) type represents a wallet whose private key is known and
stored internally in memory. A wallet must be of type [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) in order
to perform operations that involve [signing messages or transactions](./signing.md).

The [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) type represents a wallet whose private key is _not_ known or stored
in memory. Instead, [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) only knows its public address. A [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) cannot be
used to sign transactions, however it may still perform a whole suite of useful
operations including listing transactions, assets, querying balances, and so on.

Note that the [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) type implements most methods available on the [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html)
type. In other words, [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) can be thought of as a thin wrapper around [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) that
provides greater access via its private key.

## Basic Example

```ts\nimport type { WalletLocked, WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

// We can use the `generate` to create a new unlocked wallet.
const provider = new Provider(LOCAL_NETWORK_URL);
const myWallet: WalletUnlocked = Wallet.generate({ provider });

// or use an Address to create a wallet
const someWallet: WalletLocked = Wallet.fromAddress(myWallet.address, provider);\n```

## Optional Provider

You can choose not to pass through a provider argument on `Wallet` construction:

```ts\nimport type { WalletUnlocked } from 'fuels';
import { Wallet } from 'fuels';

// You can create a wallet, without a provider
let unlockedWalletWithoutProvider: WalletUnlocked = Wallet.generate();
unlockedWalletWithoutProvider = Wallet.fromPrivateKey(
  unlockedWalletWithoutProvider.privateKey
);

// All non-provider dependent methods are available
unlockedWalletWithoutProvider.lock();

// All provider dependent methods will throw
try {
  await unlockedWalletWithoutProvider.getCoins();
} catch (e) {
  console.log('error', e);
}\n```

## Transitioning States

A [`WalletLocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletLocked.html) instance can be unlocked by providing the private key:

```ts\nimport type { WalletLocked, WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);
const wallet: WalletUnlocked = Wallet.generate({ provider });
const PRIVATE_KEY = wallet.privateKey;

// Lock an existing wallet
const lockedWallet: WalletLocked = Wallet.fromAddress(wallet.address, provider);

// Unlock an existing wallet
const someUnlockedWallet: WalletUnlocked = lockedWallet.unlock(PRIVATE_KEY);\n```

A [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) instance can be locked using the `lock` method:

```ts\nimport type { WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);

const unlockedWallet: WalletUnlocked = Wallet.generate({ provider });
const newlyLockedWallet = unlockedWallet.lock();\n```

Most wallet constructors that create or generate a new wallet are provided on
the [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) type. Consider locking the wallet with the `lock` method after the new private
key has been handled in order to reduce the scope in which the wallet's private
key is stored in memory.

## Design Guidelines

When designing APIs that accept a wallet as an input, we should think carefully
about the kind of access that we require. API developers should aim to minimise
their usage of [`WalletUnlocked`](DOCS_API_URL/classes/_fuel_ts_account.WalletUnlocked.html) in order to ensure private keys are stored in
memory no longer than necessary to reduce the surface area for attacks and
vulnerabilities in downstream libraries and applications.

## Full Example

For a full example of how to lock and unlock a wallet, see the snippet below:

```ts\n// #region wallets
import type { WalletLocked, WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../env';

// We can use the `generate` to create a new unlocked wallet.
const provider = new Provider(LOCAL_NETWORK_URL);
const myWallet: WalletUnlocked = Wallet.generate({ provider });

// or use an Address to create a wallet
const someWallet: WalletLocked = Wallet.fromAddress(myWallet.address, provider);
// #endregion wallets

const wallet: WalletUnlocked = Wallet.generate({ provider });
const PRIVATE_KEY = wallet.privateKey;

// Lock an existing wallet
const lockedWallet: WalletLocked = Wallet.fromAddress(
  myWallet.address,
  provider
);

// Unlock an existing wallet
const someUnlockedWallet: WalletUnlocked = lockedWallet.unlock(PRIVATE_KEY);

const unlockedWallet: WalletUnlocked = Wallet.generate({ provider });
const newlyLockedWallet = unlockedWallet.lock();

// You can create a wallet, without a provider
let unlockedWalletWithoutProvider: WalletUnlocked = Wallet.generate();
unlockedWalletWithoutProvider = Wallet.fromPrivateKey(
  unlockedWalletWithoutProvider.privateKey
);

// All non-provider dependent methods are available
unlockedWalletWithoutProvider.lock();

// All provider dependent methods will throw
await expect(() => unlockedWalletWithoutProvider.getCoins()).rejects.toThrow(
  /Provider not set/
);\n```

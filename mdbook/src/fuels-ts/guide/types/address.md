# Address

In Sway, the [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) type serves as a type-safe wrapper around the primitive `B256` type. The SDK takes a different approach and has its own abstraction for the [Address](DOCS_API_URL/classes/_fuel_ts_address.Address.html) type.

## Address Class

The [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) class also provides a set of utility functions for easy manipulation and conversion between address formats along with one property; `b256Address`, which is of the [`B256`](./b256.md) type.

<!-- SNIPPET FILE ERROR: File not found '../../../packages/address/src/address.ts' -->

## Creating an Address

There are several ways to create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) instance:

### From a b256 address

To create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) from a 256-bit address, use the following code snippet:

```ts\nimport { Address } from 'fuels';
// #region b256-1
const b256 =
  '0xbebd3baab326f895289ecbd4210cf886ce41952316441ae4cac35f00f0e882a6';
// #endregion b256-1

const address = new Address(b256);

console.log('b256', address.toB256());
// 0xbebd3baab326f895289ecbd4210cf886ce41952316441ae4cac35f00f0e882a6\n```

### From a Public Key

To create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) from a public key, use the following code snippet:

```ts\nimport { Address, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);

const wallet = Wallet.generate({ provider });

const address = new Address(wallet.publicKey);\n```

### From an EVM Address

To create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) from an EVM address, use the following code snippet:

```ts\nimport { Address } from 'fuels';

const evmAddress = '0x675b68aa4d9c2d3bb3f0397048e62e6b7192079c';

const address = new Address(evmAddress);\n```

### From an existing Address

To create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) from an existing [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) instance, use the following code snippet:

```ts\nimport { Address } from 'fuels';

const address = Address.fromRandom();

const addressClone = new Address(address);\n```

## Utility functions

### `equals`

As you may already notice, the `equals` function can compare addresses instances:

```ts\nimport { Address } from 'fuels';

const address = Address.fromRandom();

const address1 = new Address(address.toString());
const address2 = new Address(address.toB256());

console.log('equals', address1.equals(address2));
// true\n```

### `toChecksum`

To convert an address to a checksum address, use the `toChecksum` function:

```ts\nimport { Address } from 'fuels';

const b256 =
  '0xbebd3baab326f895289ecbd4210cf886ce41952316441ae4cac35f00f0e882a6';

const address = new Address(b256);

console.log('checksum', address.toChecksum());
// true\n```

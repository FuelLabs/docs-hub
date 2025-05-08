# Address

Addresses and varying address formats are commonplace when interacting with decentralized applications. Furthermore, different networks may enforce different address formats.

The Fuel Network uses the [`B256`](../types/b256.md) address format for its interactions, an example of which can be seen below:

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/types/snippets/b256.ts' -->

However, a hexlified [B256](../types/b256.md) (hex) is another common address format; an example can be seen below:

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/types/snippets/evm-address/creating-an-evm.ts' -->
apps/

At times, these can even be wrapped in a [Struct](../types/structs.md). Such as an [Asset ID](../types/asset-id.md) or a [EVM Address](../types/evm-address.md):

<!-- SNIPPET FILE ERROR: File not found '../../docs/src/guide/types/snippets//evm-address/using-an-evm-address-1.ts' -->

The TS-SDK makes converting between these addresses simple using the [Address](../types/address.md) helper, which provides various utilities for conversion.

The following [conversion guide](./address-conversion.md#address-conversion) will show how to utilize this class to convert between address formats, as well as Sway Standard Types.

## Address Conversion

This guide demonstrates how to convert between address formats and Sway Standard Types using helper functions. Native types are wrappers for bytes, and you can perform conversions between them by leveraging these functions and classes.

## Converting a Contract ID

The Contract `id` property is an instance of the [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) class. Therefore, it can be converted using the [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) class functions such as `toAddress` and `toB256`:

```ts\nimport type { B256Address } from 'fuels';
import { Address, Provider, Contract } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../../env';
import { Counter } from '../../../../typegend/contracts';

const provider = new Provider(LOCAL_NETWORK_URL);

const contractAbi = Counter.abi;
const contractAddress = new Address(
  '0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f'
);

const contract = new Contract(contractAddress, contractAbi, provider);

const b256: B256Address = contract.id.toAddress();
// 0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f\n```

## Converting a Wallet Address

Similarly, the Wallet `address` property is also of type [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) and can therefore use the same [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) class functions for conversion:

```ts\nimport type { B256Address, WalletLocked } from 'fuels';
import { Address, Provider, Wallet } from 'fuels';

import { LOCAL_NETWORK_URL } from '../../../../env';

const provider = new Provider(LOCAL_NETWORK_URL);

const address = new Address(
  '0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f'
);

const wallet: WalletLocked = Wallet.fromAddress(address, provider);

const b256: B256Address = wallet.address.toAddress();
// 0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f\n```

## Converting an Asset ID

[Asset IDs](../types/asset-id.md) are a wrapped [`B256`](../types/b256.md) value. The following example shows how to create an [`Address`](DOCS_API_URL/classes/_fuel_ts_address.Address.html) from a `B256` type:

```ts\nimport type { AssetId, B256Address } from 'fuels';
import { Address } from 'fuels';

const b256: B256Address =
  '0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f';
const address: Address = new Address(b256);
const assetId: AssetId = address.toAssetId();
// {
//    bits: '0x6d309766c0f1c6f103d147b287fabecaedd31beb180d45cf1bf7d88397aecc6f
// }\n```

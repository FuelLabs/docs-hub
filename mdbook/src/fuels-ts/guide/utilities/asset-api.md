# Asset API

The Asset API is a RESTful API that allows you to query the assets on the Fuel blockchain. We allow for querying the Asset API on both the Mainnet and Testnet.

|         | Endpoint                                      |
| ------- | --------------------------------------------- |
| Mainnet | https://mainnet-explorer.fuel.network         |
| Testnet | https://explorer-indexer-testnet.fuel.network |

For more information about the API, please refer to the [Wiki](https://github.com/FuelLabs/fuel-explorer/wiki/Assets-API#) page.

## Asset by ID

We can request information about an asset by its asset ID, using the `getAssetById` function. This will leverage the endpoint `/assets/<assetId>` to fetch the asset information.

```ts\nimport type { AssetInfo } from 'fuels';
import { getAssetById } from 'fuels';

const asset: AssetInfo | null = await getAssetById({
  assetId: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
});

console.log('AssetInfo', asset);
// AssetInfo { ... }\n```

By default, we will request the asset information for `mainnet`. If you want to request the asset information from other networks, you can pass the `network` parameter (this is the same for the [`getAssetsByOwner`](#assets-by-owner) function).

```ts\nawait getAssetById({
  assetId: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
  network: 'testnet',
});\n```

## Assets by Owner

We can request information about an asset by its owner, using the `getAssetsByOwner` function. This will leverage the endpoint `/accounts/<owner>/assets` to fetch the asset information.

```ts\nimport type { AssetsByOwner } from 'fuels';
import { getAssetsByOwner } from 'fuels';

const assets: AssetsByOwner = await getAssetsByOwner({
  owner: '0x0000000000000000000000000000000000000000000000000000000000000000',
});

console.log('AssetsByOwner', assets);
// AssetsByOwner { data: [], pageInfo: { count: 0 } }\n```

You can change the pagination parameters to fetch more assets (up to 100 assets per request).

```ts\nawait getAssetsByOwner({
  owner: '0x0000000000000000000000000000000000000000000000000000000000000000',
  pagination: { last: 100 },
});\n```

# Asset ID

An Asset ID can be represented using the `AssetId` type. It's definition matches the Sway standard library type being a `Struct` wrapper around an inner `B256` value.

```ts\nimport type { AssetId } from 'fuels';
import { getRandomB256 } from 'fuels';

const b256 = getRandomB256();

const assetId: AssetId = {
  bits: b256,
};\n```

## Using an Asset ID

You can easily use the `AssetId` type within your Sway programs. Consider the following contract that can compares and return an `AssetId`:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-asset-id/src/main.sw' -->

The `AssetId` struct can be passed to the contract function as follows:

```ts\nconst assetId: AssetId = {
  bits: '0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c',
};

const { value } = await contract.functions
  .echo_asset_id_comparison(assetId)
  .get();\n```

And to validate the returned value:

```ts\nconst { value } = await contract.functions.echo_asset_id().get();

console.log('value', value);
// const value: AssetId = {
//   bits: '0x9ae5b658754e096e4d681c548daf46354495a437cc61492599e33fc64dcdc30c',
// };\n```

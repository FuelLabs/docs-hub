# `EvmAddress`

An Ethereum Virtual Machine (EVM) Address can be represented using the `EvmAddress` type. It's definition matches the Sway standard library type being a `Struct` wrapper around an inner `B256` value.

```ts\nimport type { B256AddressEvm, EvmAddress } from 'fuels';

const b256: B256AddressEvm =
  '0x000000000000000000000000210cf886ce41952316441ae4cac35f00f0e882a6';

const evmAddress: EvmAddress = {
  bits: b256,
};\n```

## Creating an EVM Address

An EVM Address only has 20 bytes therefore the first 12 bytes of the `B256` value are set to 0. Within the SDK, an `Address` can be instantiated and converted to a wrapped and Sway compatible EVM Address using the `toEvmAddress()` function:

```ts\nimport { Address } from 'fuels';

// #region snippet-2
const b256Address =
  '0xbebd3baab326f895289ecbd4210cf886ce41952316441ae4cac35f00f0e882a6';
// #endregion snippet-2

const address = new Address(b256Address);

const evmAddress = address.toEvmAddress();

console.log('evmAddress', evmAddress);
// '0x000000000000000000000000210cf886ce41952316441ae4cac35f00f0e882a6'\n```

## Using an EVM Address

The `EvmAddress` type can be integrated with your contract calls. Consider the following contract that can compare and return an EVM Address:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-evm-address/src/main.sw' -->

The `EvmAddress` type can be used with the SDK and passed to the contract function as follows:

```ts\n// #region snippet-2
const evmAddress: EvmAddress = {
  bits: '0x000000000000000000000000210cf886ce41952316441ae4cac35f00f0e882a6',
};
// #endregion snippet-2

const { value } = await contract.functions
  .echo_address_comparison(evmAddress)
  .get();\n```

And to validate the returned value:

```ts\nconst { value } = await contract.functions.echo_address().get();

console.log('value', value);
// { bits: '0x000000000000000000000000210cf886ce41952316441ae4cac35f00f0e882a6' }\n```

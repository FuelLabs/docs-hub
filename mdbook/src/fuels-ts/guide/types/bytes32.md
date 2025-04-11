# Bytes32

In Sway and the FuelVM, `bytes32` is used to represent hashes. It holds a 256-bit (32-bytes) value.

## Generating Random bytes32 Values

To generate a random `bytes32` value, you can use the `randomBytes` function from the fuels module:

```ts\nimport { randomBytes, type Bytes } from 'fuels';

const bytes32: Bytes = randomBytes(32);\n```

## Converting Between Byte Arrays and Strings

You can use the `hexlify` function to convert a byte array to a hex string, and the `arrayify` function to convert a hex string back to a byte array:

```ts\nimport type { Bytes } from 'fuels';
import { arrayify, hexlify, randomBytes } from 'fuels';

const randomBytes32: Bytes = randomBytes(32);

const bytes32String: string = hexlify(randomBytes32);

const bytes32: Bytes = arrayify(bytes32String);\n```

## Working with b256 in Fuel

In Fuel, there is a special type called b256, which is similar to `bytes32`. Like `bytes32`, `B256` is also used to represent hashes and holds a 256-bit value. You can learn more about working with `B256` values in the [B256 documentation](./b256.md).

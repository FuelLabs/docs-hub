# Working with Bytes

This guide aims to give a high-level overview of how to work with bytes in the SDK and the structures we expect them to take. For a complete overview of ABI Encoding generally, within the Fuel network, we recommend you see the [ABI Encoding documentation](https://docs.fuel.network/docs/specs/abi/).

## Core Types

We know the sizes of all core types at compile time. They are the building blocks of the more complex types and are the most common types you will encounter.

### Unsigned Integer (`u8` / `u16` / `u32` / `u64` / `u128` / `u256`)

Each type will only contain the number of bits specified in the name. For example, a `u8` will contain 8 bits, and a `u256` will contain 256 bits and take up the exact property space with no additional padding.

```ts\nconst u8Coder = new NumberCoder('u8');
const encodedU8 = u8Coder.encode(255);

const u16Coder = new NumberCoder('u16');
const encodedU16 = u16Coder.encode(255);

const u32Coder = new NumberCoder('u32');
const encodedU32 = u32Coder.encode(255);

const u64Coder = new BigNumberCoder('u64');
const encodedU64 = u64Coder.encode(255);

const u256Coder = new BigNumberCoder('u256');
const encodedU256 = u256Coder.encode(255);\n```

### Boolean

A boolean is encoded as a single byte like a `u8`, its value being either `0` or `1`.

```ts\nconst booleanCoder = new BooleanCoder();
const encodedTrue = booleanCoder.encode(true);

const encodedFalse = booleanCoder.encode(false);\n```

### Fixed Length String

A fixed-length string's size is known at compile time due to the argument declaration of `str[n]` with `n` denoting its length. Each character in the string is encoded as a `utf-8` bit.

```ts\nconst stringCoder = new StringCoder(5);
const encoded = stringCoder.encode('hello');\n```

### `B256` / `B512`

These are fixed-length byte arrays, with `B256` containing 256 bits and `B512` containing 512 bits. You can use them for address and signature formats.

```ts\nconst b256Coder = new B256Coder();
const encodedB256 = b256Coder.encode(hexlify(randomBytes(32)));
const b512Coder = new B512Coder();
const encodedB512 = b512Coder.encode(hexlify(randomBytes(64)));\n```

## Automatically Encoded Types

These are the types that will contain nested types and no additional encoding is required other than the encoding of the nested types. This is relevant to `array`s, `tuple`s, and `struct`s and `enum`s. The only caveat here, is an `enum` will also contain a `u64` representing the `enum` case value. `option`s are encoded in the same way as `enum`s.

```ts\nconst tupleCoder = new TupleCoder([
  new NumberCoder('u8'),
  new NumberCoder('u16'),
]);
const encodedTuple = tupleCoder.encode([255, 255]);

const structCoder = new StructCoder('struct', {
  a: new NumberCoder('u8'),
  b: new NumberCoder('u16'),
});
const encodedStruct = structCoder.encode({ a: 255, b: 255 });

const arrayCoder = new ArrayCoder(new NumberCoder('u8'), 4);
const encodedArray = arrayCoder.encode([255, 0, 255, 0]);

const enumCoder = new EnumCoder('enum', { a: new NumberCoder('u32') });
const encodedEnum = enumCoder.encode({ a: 255 });\n```

## Heap types

Heap types are types with a dynamic length that we do not know at compile time. These are `Vec`, `String`, and `raw_slice`. These types are encoded with a `u64` representing the length of the data, followed by the data itself.

```ts\nconst vecCoder = new VecCoder(new NumberCoder('u8'));
const encodedVec = vecCoder.encode([255, 0, 255]);

const stdStringCoder = new StdStringCoder();
const encodedStdString = stdStringCoder.encode('hello');

const rawSliceCoder = new RawSliceCoder();
const encodedRawSlice = rawSliceCoder.encode([1, 2, 3, 4]);\n```

## Full Example

Here is the full example of the working with bytes functions:

```ts\nimport { randomBytes } from 'crypto';
import {
  ArrayCoder,
  B256Coder,
  B512Coder,
  BigNumberCoder,
  BooleanCoder,
  EnumCoder,
  NumberCoder,
  RawSliceCoder,
  StdStringCoder,
  StringCoder,
  StructCoder,
  TupleCoder,
  VecCoder,
  hexlify,
} from 'fuels';

// #region working-with-bytes-1
const u8Coder = new NumberCoder('u8');
const encodedU8 = u8Coder.encode(255);

const u16Coder = new NumberCoder('u16');
const encodedU16 = u16Coder.encode(255);

const u32Coder = new NumberCoder('u32');
const encodedU32 = u32Coder.encode(255);

const u64Coder = new BigNumberCoder('u64');
const encodedU64 = u64Coder.encode(255);

const u256Coder = new BigNumberCoder('u256');
const encodedU256 = u256Coder.encode(255);
// #endregion working-with-bytes-1

// #region working-with-bytes-2
const booleanCoder = new BooleanCoder();
const encodedTrue = booleanCoder.encode(true);

const encodedFalse = booleanCoder.encode(false);

// #endregion working-with-bytes-2

// #region working-with-bytes-3
const stringCoder = new StringCoder(5);
const encoded = stringCoder.encode('hello');
// #endregion working-with-bytes-3

// #region working-with-bytes-4
const b256Coder = new B256Coder();
const encodedB256 = b256Coder.encode(hexlify(randomBytes(32)));
const b512Coder = new B512Coder();
const encodedB512 = b512Coder.encode(hexlify(randomBytes(64)));
// #endregion working-with-bytes-4

// #region working-with-bytes-5
const tupleCoder = new TupleCoder([
  new NumberCoder('u8'),
  new NumberCoder('u16'),
]);
const encodedTuple = tupleCoder.encode([255, 255]);

const structCoder = new StructCoder('struct', {
  a: new NumberCoder('u8'),
  b: new NumberCoder('u16'),
});
const encodedStruct = structCoder.encode({ a: 255, b: 255 });

const arrayCoder = new ArrayCoder(new NumberCoder('u8'), 4);
const encodedArray = arrayCoder.encode([255, 0, 255, 0]);

const enumCoder = new EnumCoder('enum', { a: new NumberCoder('u32') });
const encodedEnum = enumCoder.encode({ a: 255 });
// #endregion working-with-bytes-5

// #region working-with-bytes-6
const vecCoder = new VecCoder(new NumberCoder('u8'));
const encodedVec = vecCoder.encode([255, 0, 255]);

const stdStringCoder = new StdStringCoder();
const encodedStdString = stdStringCoder.encode('hello');

const rawSliceCoder = new RawSliceCoder();
const encodedRawSlice = rawSliceCoder.encode([1, 2, 3, 4]);
// #endregion working-with-bytes-6\n```

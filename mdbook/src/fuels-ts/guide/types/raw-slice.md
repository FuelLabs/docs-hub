# `RawSlice`

A dynamic array of values can be represented using the `RawSlice` type. A raw slice can be a value reference or a raw pointer.

## Using a `RawSlice`

The `RawSlice` type can be integrated with your contract calls. Consider the following contract that can compare and return a `RawSlice`:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-raw-slice/src/main.sw' -->

A `RawSlice` can be created using a native JavaScript array of numbers or Big Numbers, and sent to a Sway contract:

```ts\nconst rawSlice: RawSlice = [8, 42, 77];

const { value } = await contract.functions.echo_raw_slice(rawSlice).get();\n```

# Bytes

A dynamic array of byte values can be represented using the `Bytes` type, which represents raw bytes.

## Using Bytes

The `Bytes` type can be integrated with your contract calls. Consider the following contract that can compare and return a `Bytes`:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-bytes/src/main.sw' -->

A `Bytes` array can be created using a native JavaScript array of numbers or Big Numbers, and sent to a Sway contract:

```ts\nconst bytes: Bytes = [40, 41, 42];

const { value } = await contract.functions.echo_bytes(bytes).get();

console.log('value', value);
// Uint8Array(3)[40, 41, 42]\n```

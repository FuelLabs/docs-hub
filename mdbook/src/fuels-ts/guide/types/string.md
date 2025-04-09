# String

In Sway, strings are statically-sized, which means you must define the size of the string beforehand. Statically-sized strings are represented using the `str[x]` syntax, where `x` indicates the string's size.
This guide explains how to create and interact with statically-sized strings while using the SDK.

## Creating Statically-Sized Strings

```ts\n// Sway str[2]
const stringSize2 = 'st';

// Sway str[8]
const stringSize8 = 'fuel-sdk';\n```

## Interacting with Statically-Sized Strings in Contract Methods

When a contract method accepts and returns a `str[8]`, the corresponding SDK wrapper method will also take and return a string of the same length. You can pass a string to the contract method like this:

```ts\nconst { value } = await contract.functions.echo_str_8('fuel-sdk').get();

console.log('value', value);
// 'fuel-sdk'\n```

When working with statically-sized strings, ensure that the input and output strings have the correct length to avoid erroneous behavior.

If you pass a string that is either too long or too short for a contract method, the call will fail like this:

```ts\nconst longString = 'fuel-sdk-WILL-THROW-ERROR';

try {
  await contract.functions.echo_str_8(longString).call();
} catch (error) {
  console.log('error', error);
  // Value length mismatch during encode
}

const shortString = 'THROWS';

try {
  await contract.functions.echo_str_8(shortString).call();
} catch (error) {
  console.log('error', error);
  // Value length mismatch during encode
}\n```

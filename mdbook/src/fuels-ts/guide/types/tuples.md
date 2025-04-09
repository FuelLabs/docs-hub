# Tuples

In Sway, Tuples are fixed-length collections of heterogeneous elements. Tuples can store multiple data types, including basic types, structs, and enums. This guide will demonstrate how to represent and work with Tuples in TypeScript and interact with a contract function that accepts a tuple as a parameter.

In TypeScript, you can represent Sway tuples using arrays with specified types for each element:

```ts\n// Sway let tuple2: (u8, bool, u64) = (100, false, 10000);
// #region tuples-3
const tuple: [number, boolean, number] = [100, false, 10000];\n```

In this example, the Typescript `tuple` variable contains three elements of different types: a number, a boolean, and another number.

## Example: Passing Tuple as a Parameter

Let's consider a contract function that accepts a tuple as a parameter and returns the same Tuple:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-values/src/main.sw' -->

To execute and validate the contract function using the SDK, follow these steps:

```ts\nconst tuple: [number, boolean, number] = [100, false, 10000];
// #endregion tuples-1

const { value } = await contract.functions.echo_tuple(tuple).simulate();

console.log('value', value);
// [100, false, <BN 0x2710>]\n```

In this example, we create a Tuple with three elements, call the `echo_tuple` contract function, and expect the returned tuple to match the original one. Note that we convert the third element of the returned tuple to a number using `new BN(value[2]).toNumber()`.

Tuples in Sway provide a convenient way to store and manipulate collections of heterogeneous elements. Understanding how to represent and work with tuples in TypeScript and Sway contracts will enable you to create more versatile and expressive code.

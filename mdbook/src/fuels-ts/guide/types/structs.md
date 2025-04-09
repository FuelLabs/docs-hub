# Structs

In Sway, a `struct` serves a similar purpose as an `Object` in TypeScript. It defines a custom data structure with specified property names and types. The property names and types in the Sway struct must match the corresponding TypeScript definition.

## Example

Here is an example of a `struct` in Sway:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/employee-data/src/lib.sw' -->

And here is the equivalent structure represented in TypeScript:

```ts\ntype EmployeeDataStruct = {
  name: string;
  age: number;
  salary: number;
  idHash: string;
  ratings: number[];
  isActive: boolean;
};

const data: EmployeeDataStruct = {
  name: 'John Doe',
  age: 30,
  salary: 100_000,
  idHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  ratings: [4, 5, 5],
  isActive: true,
};\n```

## Handling Different Data Types

Please note that TypeScript does not have native support for `u8` and `u64` types. Instead, use the `number` type to represent them.

Additionally, TypeScript does not support specifying string length, so just use `string` for the `name`.

In a similar way, since the type `B256` on the SDK is just an hexlified string, we use `string` as well.

# Vectors

In Sway, a Vector is a dynamic-sized collection of elements of the same type. Vectors can hold arbitrary types, including non-primitive types.

## Working with Vectors in the SDK

A basic Vector in Sway is similar to a TypeScript Array:

```ts\n// Sway Vec<u8>
const basicU8Vector = [1, 2, 3];\n```

Consider the following example of a `EmployeeData` struct in Sway:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/employee-data/src/lib.sw' -->

Now, let's look at the following contract method. It receives a Vector of the `Transaction` struct type as a parameter and returns the last `Transaction` entry from the Vector:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/echo-employee-data-vector/src/main.sw' -->

The code snippet below demonstrates how to call this Sway contract method, which accepts a `Vec<Transaction>`:

```ts\nconst employees: EmployeeDataInput[] = [
  {
    name: 'John Doe',
    age: 30,
    salary: bn(8000),
    idHash: getRandomB256(),
    ratings: [1, 2, 3],
    isActive: true,
  },
  {
    name: 'Everyman',
    age: 31,
    salary: bn(9000),
    idHash: getRandomB256(),
    ratings: [5, 6, 7],
    isActive: true,
  },
];
const { value } = await contract.functions
  .echo_last_employee_data(employees)
  .simulate();\n```

## Converting Bytecode to Vectors

Some functions require you to pass in bytecode to the function. The type of the bytecode parameter is usually `Vec<u8>`, here's an example of how to pass bytecode to a function:

<!-- SNIPPET FILE ERROR: File not found '../../docs/sway/bytecode-input/src/main.sw' -->

To pass bytecode to this function, you can make use of the `arrayify` function to convert the bytecode file contents into a `UInt8Array`, the TS compatible type for Sway's `Vec<u8>` type and pass it the function like so:

```ts\nconst bytecodeAsVecU8 = Array.from(arrayify(BytecodeInputFactory.bytecode));

const { waitForResult } = await bytecodeContract.functions
  .compute_bytecode_root(bytecodeAsVecU8)
  .call();

const { value: bytecodeRoot } = await waitForResult();\n```

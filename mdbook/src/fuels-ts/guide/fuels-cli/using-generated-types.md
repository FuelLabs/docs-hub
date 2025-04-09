<!-- TODO: Replace plan-text by code-snippets -->

# Using Generated Types

After generating types via:

```console
pnpm fuels typegen -i ./abis/*-abi.json -o ./types
```

We can use these files like so:

<!-- SNIPPET FILE ERROR: File not found '../../demo-typegen/src/demo.test.ts' -->

## Contract

Let's use the Contract class to deploy a contract:

<!-- SNIPPET FILE ERROR: File not found '../../demo-typegen/src/demo.test.ts' -->

### Autoloading of Storage Slots

Typegen tries to resolve, auto-load, and embed the [Storage Slots](../contracts/storage-slots.md) for your Contract within the `MyContract` class. Still, you can override it alongside other options from [`DeployContractOptions`](https://github.com/FuelLabs/fuels-ts/blob/a64b67b9fb2d7f764ab9151a21d2266bf2df3643/packages/contract/src/contract-factory.ts#L19-L24), when calling the `deploy` method:

<!-- SNIPPET FILE ERROR: File not found '../../demo-typegen/src/demo.test.ts' -->

## Script

After generating types via:

```console
pnpm fuels typegen -i ./abis/*-abi.json -o ./types --script
```

We can use these files like so:

<!-- SNIPPET FILE ERROR: File not found '../../demo-typegen/src/demo.test.ts' -->

## Predicate

After generating types via:

```console
pnpm fuels typegen -i ./abis/*-abi.json -o ./types --predicate
```

We can use these files like so:

<!-- SNIPPET FILE ERROR: File not found '../../demo-typegen/src/demo.test.ts' -->

See also:

- [Generating Types for Contracts](./generating-types.md#generating-types-for-contracts)
- [Generating Types for Scripts](./generating-types.md#generating-types-for-scripts)
- [Generating Types for Predicates](./generating-types.md#generating-types-for-predicates)

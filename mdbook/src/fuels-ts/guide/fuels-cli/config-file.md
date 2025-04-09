# Config File

Here, you can learn more about all configuration options.

## `workspace`

Relative directory path to Forc workspace.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _The property `workspace` is incompatible with [`contracts`](#contracts), [`predicates`](#predicates), and [`scripts`](#scripts)._

## `contracts`

List of relative directory paths to Sway contracts.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _The property `contracts` is incompatible with [`workspace`](#workspace)._

## `predicates`

List of relative directory paths to Sway predicates.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _The property `predicates` is incompatible with [`workspace`](#workspace)._

## `scripts`

List of relative directory paths to Sway scripts.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _The property `scripts` is incompatible with [`workspace`](#workspace)._

## `output`

Relative directory path to use when generating Typescript definitions.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `providerUrl`

The URL to use when deploying contracts.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _When [`autostartFuelCore`](#autostartfuelcore) property is set to `true`, the `providedUrl` is overridden by that of the local short-lived `fuel-core` node started by the [`fuels dev`](./commands.md#fuels-dev) command._

## `privateKey`

Wallet private key, used when deploying contracts.

This property should ideally come from env — `process.env.MY_PRIVATE_KEY`.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

> _When [`autostartFuelCore`](#autostartfuelcore) property is set to `true`, the `privateKey` is overridden with the `consensusKey` of the local short-lived `fuel-core` node started by the [`fuels dev`](./commands.md#fuels-dev) command._

## `snapshotDir`

> - _Used by [`fuels dev`](./commands.md#fuels-dev) only_.

Relative path to directory containing custom configurations for `fuel-core`, such as:

- `chainConfig.json`
- `metadata.json`
- `stateConfig.json`

This will take effect only when [`autoStartFuelCore`](#autostartfuelcore) is `true`.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `autoStartFuelCore`

> - _Used by [`fuels dev`](./commands.md#fuels-dev) only_.

When set to `true`, it will automatically:

1. Starts a short-lived `fuel-core` node as part of the [`fuels dev`](./commands.md#fuels-dev) command
1. Override property [`providerUrl`](#providerurl) with the URL for the recently started `fuel-core` node

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

If set to `false`, you must spin up a `fuel-core` node by yourself and set the URL for it via [`providerUrl`](#providerurl).

## `fuelCorePort`

> - _Used by [`fuels dev`](./commands.md#fuels-dev) only_.
> - _Ignored when [`autoStartFuelCore`](#autostartfuelcore) is set to `false`._

Port to use when starting a local `fuel-core` node.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `forcBuildFlags`

> - _Used by [`fuels build`](./commands.md#fuels-build) and [`fuels deploy`](./commands.md#fuels-deploy)_.

Sway programs are compiled in `debug` mode by default.

Here you can customize all build flags, e.g. to build programs in `release` mode.

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

Check also:

- [Forc docs](https://docs.fuel.network/docs/forc/commands/forc_build/#forc-build)

## `deployConfig`

You can supply a ready-to-go deploy configuration object:

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

Or use a function for crafting dynamic deployment flows:

- If you need to fetch and use configs or data from a remote data source
- If you need to use IDs from already deployed contracts — in this case, we can use the `options.contracts` property to get the necessary contract ID. For example:

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `onBuild`

A callback function that is called after a build event has been successful.

Parameters:

- `config` — The loaded config (`fuels.config.ts`)

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `onDeploy`

A callback function that is called after a deployment event has been successful.

Parameters:

- `config` — The loaded config (`fuels.config.ts`)
- `data` — The data (an array of deployed contracts)

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `onDev`

A callback function that is called after the [`fuels dev`](./commands.md#fuels-dev) command has successfully restarted.

Parameters:

- `config` — The loaded config (`fuels.config.ts`)

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `onNode`

A callback function that is called after the [`fuels node`](./commands.md#fuels-node) command has successfully refreshed.

Parameters:

- `config` — The loaded config (`fuels.config.ts`)

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `onFailure`

Pass a callback function to be called in case of errors.

Parameters:

- `config` — The loaded config (`fuels.config.ts`)
- `error` — Original error object

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `forcPath`

Path to the `forc` binary.

When not supplied, will default to using the `system` binaries (`forc`).

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## `fuelCorePath`

Path to the `fuel-core` binary.

When not supplied, will default to using the `system` binaries (`fuel-core`).

<!-- SNIPPET FILE ERROR: File not found '../../demo-fuels/fuels.config.full.ts' -->

## Loading environment variables

If you want to load environment variables from a `.env` file, you can use the `dotenv` package.

First, install it:

::: code-group

```sh [pnpm]
pnpm install dotenv
```

```sh [npm]
npm install dotenv
```

```sh [bun]
bun install dotenv
```

:::

Then, you can use it in your `fuels.config.ts` file:

<!-- SNIPPET FILE ERROR: File not found '../../create-fuels-counter-guide/fuels.config.ts' -->

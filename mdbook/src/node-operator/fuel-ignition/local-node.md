# Running a local Fuel node

In addition to deploying and testing on the Fuel Testnet, you can also run a local Fuel Node.

There are two types of Fuel networks that can be run:

1. In-memory network (without persistence)
2. Local network with persistence

## Using `forc node` to run a Local Node

> If you wish to still use the `fuel-core` binary directly, you can skip this section and continue with the steps below.

Make sure you have the [latest version of `fuelup` installed or updated](https://docs.fuel.network/guides/contract-quickstart/#installation). `forc node` abstracts all the flags and configuration options of the `fuel-core` binary and is intended for ease of use. To run a local node using `forc`, you can use the following command:

```sh
forc node local
```

This command will start a local node with the default configuration (with state persistence). The default configuration is highlighted in green at the top of the command output.

If you want to specify a custom configuration, you can use the `--help` flag to see the available options. For example:

```sh
forc node local --help
```

### Dry-run mode

Users of this new plugin may want to review the parameters before running the node. To accommodate this, `forc-node` includes a dry-run mode, which can be enabled using:

```sh
forc-node --dry-run local
```

Instead of starting the node, this command will print the exact command that would be run, allowing you to verify the parameters beforehand.

## Using `fuel-core` binary to run a local node

If you wish to still use the `fuel-core` binary directly, you can follow the steps below.

## In-memory local node (without state persistence)

An in-memory node does not persist the blockchain state anywhere, it is only stored in memory as long as the node is active and running.

First ensure your environments [open files limit](https://askubuntu.com/questions/162229/how-do-i-increase-the-open-files-limit-for-a-non-root-user) `ulimit` is increased, example:

```sh
ulimit -S -n 32768
```

After ensuring your file limit is increased, to spin-up a local in-memory Fuel node download or copy the local snapshot from [here](https://github.com/FuelLabs/chain-configuration/tree/master/local), then run the following command:

```sh
fuel-core run --db-type in-memory --debug --snapshot ./your/path/to/chain_config_folder
```

To deploy a contract to the local node, run the following command:

```sh
forc deploy <signing-key> --node-url 127.0.0.1:4000/v1/graphql
```

Or to deploy with the default signer that is pre-funded by fuel-core:

```sh
forc deploy --default-signer --node-url 127.0.0.1:4000/v1/graphql
```

## Chain Configuration

To modify the initial state of the chain, you must configure the `state_config.json` file in your chain configuration folder.

For simplicity, clone the [repository](https://github.com/FuelLabs/chain-configuration/tree/master) into the directory of your choice.

When using the `--snapshot` flag later, you can replace `./your/path/to/chain_config_folder` with the `local` folder of the repository you just cloned `./chain-configuration/local/`.

To start the node with a custom configuration, you can use the command below:

```sh
fuel-core run --snapshot ./your/path/to/chain_config_folder --db-type in-memory --debug
```

To find an example `local` chain configuration folder for a specific `fuel-core` version, refer to the [`chain-configuration/local`](https://github.com/FuelLabs/chain-configuration/tree/master/local) repo.

### Funding a wallet locally

You can edit the `coins` array inside `state_config.json` to modify the initial assets owned by a given address.

The `owner` address must be a `B256` type address (begins with `0x`) instead of a `Bech32` type (begins with `fuel`).

The `amount` is a numerical value. In the example below, the value translates to 1 ETH.

```json
"coins": [
  {
    "tx_id": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "output_index": 0,
    "tx_pointer_block_height": 0,
    "tx_pointer_tx_idx": 0,
    "owner": "0x488284d46414347c78221d3bad71dfebcff61ab2ae26d71129701d50796f714d",
    "amount": 1000000000,
    "asset_id": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"
  }
]
```

## Local node (with state persistence)

This node does persist the blockchain state locally.
To run a local node with persistence a chain configuration file is required.

To start the node, run the following command:

```sh
fuel-core run --ip 127.0.0.1 --port 4000 --snapshot ./your/path/to/chain_config_folder --db-path ./.fueldb --debug
```

## Connecting to the local node from a browser wallet

To connect to the local node using a browser wallet, import the network address as:

```sh
http://127.0.0.1:4000/v1/graphql
```

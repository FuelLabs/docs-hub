# The `beta-3` testnet

The `beta-3` network is the latest Fuel testnet. It expands on the features of `beta-2`, introducing P2P networking and the ability to run synchronizing full nodes.

Ethereum contracts (Goerli):

"FuelMessagePortal": `0xE6B0E27F85abaCfC5149642c30F4BE9a878Aa4e9`

"FuelChainConsensus": `0x4b4b74b2E5CD9775793779619C3547b7863EbEca`

"FuelERC20Gateway": `0x8083634a1A5092D3234657092e5CF74655191B8D`

The ERC-20 Gateway contract on Georli Ethereum is at `0x8083634a1A5092D3234657092e5CF74655191B8D`.

Goerli block explorer: [https://goerli.etherscan.io/](https://goerli.etherscan.io/)

🚰 Faucet - Use the faucet to get test ETH to deploy contracts with or to interact with contracts. Available here: [https://faucet-beta-3.fuel.network/](https://faucet-beta-3.fuel.network/).

📃 GraphQL endpoint - The Fuel Core node uses GraphQL instead of JSON RPC. A playground for the public GraphQL endpoint for beta-3 is available at [https://beta-3.fuel.network/playground](https://beta-3.fuel.network/playground).

🔍 Block explorer - A block explorer (still heavily in development) is available at [https://fuellabs.github.io/block-explorer-v2/](https://fuellabs.github.io/block-explorer-v2/). Be sure to select `beta-3` from the dropdown on the top right.

Join the [Fuel Labs Discord](https://discord.com/invite/fuelnetwork) and head to the 🧪︱testnet channel to get support from our team.

## SDK Versioning

Version 0.38.0 or higher is the recommended version of the TS SDK on `beta-3`.  

Version 0.39.0 or higher is the recommended version for the Rusk SDK on `beta-3`.

## Toolchain Configuration

To configure the optimal toolchain for `beta-3`, ensure you have [fuelup](/docs/fuelup) installed, then run the following command:

```shell
fuelup self update
```

Then install the beta-3 toolchain with

```shell
fuelup toolchain install beta-3
```

This installs the following components and versions:

- forc 0.37.0
- forc-explore 0.28.1
- forc-index 0.7.0
- forc-wallet 0.2.2
- fuel-core 0.17.8
- fuel-indexer 0.7.0

To set the `beta-3` toolchain as your default, run

```console
$ fuelup default beta-3
default toolchain set to 'beta-3-aarch64-apple-darwin'
```

## Predicate

Messages intended for contracts use a pre-defined predicate as the message recipient. This predicate allows anyone to relay the message to the target contract and only the target contract. Once the contract receives the message it can see who originated it along with any special message payload and processes it accordingly. Since anyone can relay the message using this predicate it opens up possibilities for automated message processing as a service.

The predicate root for the beta-3 testnet is `0x4df15e4a7c602404e353b7766db23a0d067960c201eb2d7a695a166548c4d80a`.
# The `beta-2` testnet

The `beta-2` network is launched with a bridge to Ethereum's Goerli test network. With this network, developers are able to build and test cross-chain dapps, laying the foundations for projects building on Fuel to tap into Ethereum's massive liquidity and existing user base.

Ethereum contracts (Goerli):

"FuelMessagePortal": `0x4c7181fff2053D232Fc74Ff165b83FE8Dcb65910`

"BinaryMerkleTreeLib": `0x40Ab53ba8BEEe302539f417eCC6C5FBb99F3B7Cd`

"FuelSidechainConsensus": `0xF712e555ce59858f680890DA7dc2B51eD048580d`

"L1ERC20Gateway": `0x96c53cd98B7297564716a8f2E1de2C83928Af2fe`

The ERC-20 Gateway contract on Georli Ethereum is at `0x96c53cd98B7297564716a8f2E1de2C83928Af2fe`.

You can view a test ERC-20 token contract at `0x9c3f3a5a53bD127a51Ae9622EC43488FE6a4DcCd` on Goerli Ethereum with the corresponding Fuel side token contract deployed at `0x250cbf149be078027eed12eba0fe07617b398ccc8ccf1f43a02adddd4e4f8e56` on the `beta-2` testnet.

Goerli block explorer: [https://goerli.etherscan.io/](https://goerli.etherscan.io/)

🚰 Faucet - Use the faucet to get test ETH to deploy contracts with or to interact with contracts. Available here: [https://faucet-beta-2.fuel.network/](https://faucet-beta-2.fuel.network/).

📃 GraphQL endpoint - The Fuel Core node uses GraphQL instead of JSON RPC. A playground for the public GraphQL endpoint for beta-1 is available at [https://node-beta-2.fuel.network/playground](https://node-beta-2.fuel.network/playground).

🔍 Block explorer - A block explorer (still heavily in development) is available at [https://fuellabs.github.io/block-explorer-v2/](https://fuellabs.github.io/block-explorer-v2/). Be sure to select `beta-2` from the dropdown on the top right.

Join the [Fuel Labs Discord](https://discord.com/invite/fuelnetwork) and head to the 🧪︱testnet-beta-2 channel to get support from our team.

## SDK Versioning

Version 0.21.0 is the recommended version of the TS SDK on `beta-2`.  

Version 0.30.0 is the recommended version for the Rusk SDK on `beta-2`.

## Toolchain Configuration

To configure the optimal toolchain for `beta-2`, ensure you have [fuelup](https://fuellabs.github.io/fuelup/v0.12.0/) installed, then run the following command:

```console
$ fuelup self update
Fetching binary from https://github.com/FuelLabs/fuelup/releases/download/v0.12.0/fuelup-0.12.0-aarch64-apple-darwin.tar.gz
Downloading component fuelup without verifying checksum
Unpacking and moving fuelup to /var/folders/tp/0l8zdx9j4s9_n609ykwxl0qw0000gn/T/.tmplX61Ng
Moving /var/folders/tp/0l8zdx9j4s9_n609ykwxl0qw0000gn/T/.tmplX61Ng/fuelup to /Users/camiinthisthang/.fuelup/bin/fuelup
`$ fuelup toolchain install beta-2.`
Downloading: forc forc-explore forc-wallet fuel-core

Adding component forc v0.31.1 to 'beta-2-aarch64-apple-darwin'
Fetching binary from https://github.com/FuelLabs/sway/releases/download/v0.31.1/forc-binaries-darwin_arm64.tar.gz
Unpacking and moving forc-doc to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Unpacking and moving forc to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Unpacking and moving forc-deploy to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Unpacking and moving forc-run to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Unpacking and moving forc-lsp to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Unpacking and moving forc-fmt to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Fetching core forc dependencies
Installed forc v0.31.1 for toolchain 'beta-2-aarch64-apple-darwin'

Adding component forc-explore v0.28.1 to 'beta-2-aarch64-apple-darwin'
Fetching binary from https://github.com/FuelLabs/forc-explorer/releases/download/v0.28.1/forc-explore-0.28.1-aarch64-apple-darwin.tar.gz
Unpacking and moving forc-explore to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Installed forc-explore v0.28.1 for toolchain 'beta-2-aarch64-apple-darwin'

Adding component forc-wallet v0.1.2 to 'beta-2-aarch64-apple-darwin'
Fetching binary from https://github.com/FuelLabs/forc-wallet/releases/download/v0.1.2/forc-wallet-0.1.2-aarch64-apple-darwin.tar.gz
Unpacking and moving forc-wallet to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Installed forc-wallet v0.1.2 for toolchain 'beta-2-aarch64-apple-darwin'

Adding component fuel-core v0.14.1 to 'beta-2-aarch64-apple-darwin'
Fetching binary from https://github.com/FuelLabs/fuel-core/releases/download/v0.14.1/fuel-core-0.14.1-aarch64-apple-darwin.tar.gz
Unpacking and moving fuel-core to /Users/camiinthisthang/.fuelup/toolchains/beta-2-aarch64-apple-darwin/bin
Installed fuel-core v0.14.1 for toolchain 'beta-2-aarch64-apple-darwin'
```

This installs the following components and versions:

- forc 0.31.1
- forc-explore 0.28.1
- forc-wallet 0.1.2
- fuel-core 0.14.1

## Predicate

Messages intended for contracts use a pre-defined predicate as the message recipient. This predicate allows anyone to relay the message to the target contract and only the target contract. Once the contract receives the message it can see who originated it along with any special message payload and processes it accordingly. Since anyone can relay the message using this predicate it opens up possibilities for automated message processing as a service.

The predicate root is `0xc453f2ed45abb180e0a17aa88e78941eb8169c5f949ee218b45afcb0cfd2c0a8`.
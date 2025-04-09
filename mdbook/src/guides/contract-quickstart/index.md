
# Smart Contract Quickstart

Getting started with Fuel as a smart contract developer is as simple as:

1. [Installing](#installation) `fuelup`
2. [Generating a counter contract](#generating-a-counter-contract)
3. [Building the contract](#building-the-contract)
4. [Setting up a local wallet](#setting-up-a-local-wallet)
5. [Deploying the contract](#deploying-the-contract)

## Installation

<TextImport
  file="../installation/index.mdx"
  comment="install_fuelup"
  commentType="





<CodeImport
  file="../counter-dapp/building-a-smart-contract.mdx"
  comment="new_forc_contract"
  commentType="

Copy and paste the code below into your `src/main.sw` file



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="all"
  commentType="/*"
  lang="sway"
/>

Next, run the `forc build` command:



```sh
forc build
```

## Setting up a local wallet

<TextImport
  file="../installation/index.mdx"
  comment="forc_wallet_setup"
  commentType="{/*"
/>

You can get test funds using the [faucet](https://faucet-testnet.fuel.network/).

## Deploying the contract

To deploy the contract to the testnet, you can run:

```sh
forc deploy --testnet
```

<TextImport
  file="../counter-dapp/building-a-smart-contract.mdx"
  comment="forc_wallet"
  commentType="{/*"
/>

## Next Steps

Ready to learn more? Check out the following resources:

- Learn the step-by-step instructions for how to build a full-stack [counter contract dapp](/guides/counter-dapp)
- Build a full-stack marketplace dapp with the [Intro to Sway](/guides/intro-to-sway) guide
- Try building with [Predicates](/guides/intro-to-predicates)
- Read the [Sway docs](/docs/sway)

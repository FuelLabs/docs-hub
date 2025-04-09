
# Prerequisites

## Installation

<TextImport
  file="../installation/index.mdx"
  comment="install_fuelup"
  commentType=".
You can check your Node.js version with:

```sh
node -v
```

## Project Setup

Start with a Fuel template and name it `sway-store`.



```sh
pnpm create fuels --pnpm sway-store
```

Go into the `sway-store` folder:

```sh
cd sway-store
```

There should already be a folder called `sway-programs` inside, where your Sway programs will live. Ignore the other programs as we will only focus on the `contract` program type in this tutorial. Move into your `contract` folder:

```sh
cd sway-programs/contract
```

Open up the `contract` folder in VSCode, and inside the `src` folder you should see a file called `main.sw`. This is where you will write your Sway contract.

Since we're creating a brand new contract you can delete everything in this file except for the `contract` keyword.



<CodeImport
  file="../../examples/intro-to-sway/sway-store/sway-programs/contract/src/main.sw"
  comment="contract"
  commentType="//"
  lang="sway"
/>

The first line of the file is specifically reserved to inform the compiler whether we are writing a contract, script, predicate, or library. To designate the file as a contract, use the `contract` keyword.

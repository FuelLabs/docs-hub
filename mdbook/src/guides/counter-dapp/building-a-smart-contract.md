
# Writing A Sway Smart Contract

## Installation

<TextImport
  file="../installation/index.mdx"
  comment="install_fuelup"
  commentType="
> Having problems? Visit the [installation guide](/guides/installation) or post your question in our [forum](https://forum.fuel.network/).


<TextImport
  file="../installation/index.mdx"
  comment="install_VSCode_extensions"
  commentType="
If you already have `fuelup` installed, run the commands below to make sure you are on the most up-to-date toolchain.

```sh
fuelup self update
fuelup update
fuelup default latest
```



## Your First Sway Project

We'll build a simple counter contract with two functions: one to increment the counter, and one to return the value of the counter.

**Start by creating a new, empty folder. We'll call it `fuel-project`.**



```sh
mkdir fuel-project
```

### Writing the Contract

Move inside of your `fuel-project` folder:

```sh
cd fuel-project
```

Then create a contract project using `forc`:





```sh
forc new counter-contract
```



You will get this output:

```sh
To compile, use `forc build`, and to run tests use `forc test`
----
Read the Docs:
- Sway Book: https://docs.fuel.network/docs/sway
- Forc Book: https://docs.fuel.network/docs/forc
- Rust SDK Book: https://docs.fuel.network/docs/fuels-rs
- TypeScript SDK: https://docs.fuel.network/docs/fuels-ts

Join the Community:
- Follow us @SwayLang: https://twitter.com/SwayLang
- Ask questions on Discourse: https://forum.fuel.network/

Report Bugs:
- Sway Issues: https://github.com/FuelLabs/sway/issues/new
```



Here is the project that `forc` has initialized:



```sh
tree counter-contract
```

```sh
counter-contract
├── Forc.toml
└── src
    └── main.sw

1 directory, 2 files
```

`forc.toml` is the *manifest file* (similar to `Cargo.toml` for Cargo or `package.json` for Node) and defines project metadata such as the project name and dependencies.


Open your project in a code editor and delete everything in `src/main.sw` apart from the first line.

Every Sway file must start with a declaration of what type of program the file contains; here, we've declared that this file is a contract.
You can learn more about Sway program types in the [Sway Book](/docs/sway/sway-program-types/).



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="contract"
  commentType="//"
  lang="sway"
/>

Next, we'll define a storage value.
In our case, we have a single counter that we'll call `counter` of type `u64` (a 64-bit unsigned integer) and initialize it to 0.



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="storage"
  commentType="//"
  lang="sway"
/>

### ABI

ABI stands for Application Binary Interface.
An ABI defines an interface for a contract.
A contract must either define or import an ABI declaration.

It is considered best practice to define your ABI in a separate library and import it into your contract.
This allows callers of the contract to import and use the ABI more easily.

For simplicity, we will define the ABI directly in the contract file itself.



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="abi"
  commentType="//"
  lang="sway"
/>

### Implement ABI

Below your ABI definition, you will write the implementation of the functions defined in your ABI.



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="counter-contract"
  commentType="//"
  lang="sway"
/>

> `storage.counter.read()` is an implicit return and is equivalent to `return storage.counter.read();`.

Here's what your code should look like so far:

File: `./counter-contract/src/main.sw`



<CodeImport
  file="../../examples/counter-dapp/counter-contract/src/main.sw"
  comment="all"
  commentType="/*"
  lang="sway"
/>

### Build the Contract

Navigate to your contract folder:

```sh
cd counter-contract
```

Then run the following command to build your contract:



```sh
forc build
```

```sh
  Compiled library "core".
  Compiled library "std".
  Compiled contract "counter-contract".
  Bytecode size: 84 bytes.
```

Let's have a look at the content of the `counter-contract` folder after building:



```sh
tree .
```

```sh
.
├── Forc.lock
├── Forc.toml
├── out
│   └── debug
│       ├── counter-contract-abi.json
│       ├── counter-contract-storage_slots.json
│       └── counter-contract.bin
└── src
    └── main.sw

3 directories, 6 files
```

We now have an `out` directory that contains our build artifacts such as the JSON representation of our ABI and the contract bytecode.

## Testing your Contract with Rust

> Don't want to test with Rust? Skip this section and jump to [Deploy the Contract](#deploy-the-contract).

We will start by adding a Rust integration test harness using a Cargo generate template.
If you don't already have `Rust` installed, you can install it by running this command:

<CodeImport
  file="../installation/index.mdx"
  comment="install_rust_command"
  commentType="
We have two new files!

- The `Cargo.toml` is the manifest for our new test harness and specifies the required dependencies including `fuels` (the Fuel Rust SDK).
- The `tests/harness.rs` contains some boilerplate test code to get us started, though doesn't call any contract methods just yet.

Open your `Cargo.toml` file and check the version of `fuels` used under `dev-dependencies`. Change the version to `0.66.1` if it's not already:

```toml
[dev-dependencies]
fuels = "0.66.1"
tokio = { version = "1.12", features = ["rt", "macros"] }
```



Now that we have our default test harness, let's add a useful test to it.

At the bottom of `test/harness.rs` below the `can_get_contract_id()` test, add the `test_increment` test function below to verify that the value of the counter gets incremented:



<CodeImport
  file="../../examples/counter-dapp/counter-contract/tests/harness.rs"
  comment="contract-test"
  commentType="//"
  lang="rust"
/>

Here is what your file should look like:

File: `./counter-contract/tests/harness.rs`



<CodeImport
  file="../../examples/counter-dapp/counter-contract/tests/harness.rs"
  comment="contract-test-all"
  commentType="/*"
  lang="rust"
/>

Run `cargo test` in the terminal:

```sh
cargo test
```

If all goes well, the output should look as follows:

```sh
  ...
  running 2 tests
  test can_get_contract_id ... ok
  test test_increment ... ok
  test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.25s
```

## Deploy the Contract

It's now time to deploy . We will show how to do this using `forc` from the command line, but you can also do it using the [Rust SDK](/docs/fuels-rs/deploying) or the [TypeScript SDK](/docs/fuels-ts/contracts/deploying-contracts).

In order to deploy a contract, you need to have a wallet to sign the transaction and coins to pay for gas. `Fuelup` will guide you in this process.

### Setting up a local wallet

<TextImport
  file="../installation/index.mdx"
  comment="forc_wallet_setup"
  commentType="
The terminal will ask for the password of the wallet:

`Please provide the password of your encrypted wallet vault at "~/.fuel/wallets/.wallet":`

Once you have unlocked the wallet, the terminal will show a list of the accounts:

```sh
Account 0 -- fuel18caanqmumttfnm8qp0eq7u9yluydxtqmzuaqtzdjlsww5t2jmg9skutn8n:
  Asset ID                                                           Amount
  0000000000000000000000000000000000000000000000000000000000000000 499999940
```

Just below the list, you'll see this prompt:

`Please provide the index of account to use for signing:`

Then you'll enter the number of the account of preference and press `Y` when prompted to accept the transaction.

Finally, you will get back the network endpoint where the contract was deployed, a `Contract ID` and the block where the transaction was signed.


Save the `Contract ID`, as you'll need this later to connect the frontend.

```sh
Contract counter-contract Deployed!

Network: https://testnet.fuel.network
Contract ID: 0x8342d413de2a678245d9ee39f020795800c7e6a4ac5ff7daae275f533dc05e08
Deployed in block 0x4ea52b6652836c499e44b7e42f7c22d1ed1f03cf90a1d94cd0113b9023dfa636
```

### Congrats, you have completed your first smart contract on Fuel ⛽

[Here is the repo for this project](https://github.com/FuelLabs/docs-hub/tree/master/docs/guides/examples/counter-dapp). If you run into any problems, a good first step is to compare your code to this repo and resolve any differences.

Tweet us [@fuel_network](https://twitter.com/fuel_network) letting us know you just built a dapp on Fuel, you might get invited to a private group of builders, be invited to the next Fuel dinner, get alpha on the project, or something 👀.

## Need Help?

Get help from the team by posting your question in the [Fuel Forum](https://forum.fuel.network/).

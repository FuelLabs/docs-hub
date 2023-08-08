# Why Fuel?

## User Sovereignty with Fraud Proofs

Fuel was designed and built specifically to be fraud-provable, which enable support for trust-minimized light clients. Trust minimized light clients and shared data availability enables trust minimized bridges to other modular execution layers, something impossible to achieve between L1s.

What this means in practice:

- Long-term liquidity access
- Users can validate the chain without having to run full nodes
- Safely bridging assets

Fuel’s optimization for fraud proofs is the use of the UTXO model, which in turn means Fuel has no global state tree or account trees. If you wanted to apply the general construction of a fraud proof to a chain that uses the account model like Ethereum, the cost could be unbound, making it extremely expensive to produce a fraud proof. In this general construction of a fraud proof, given a pre-state and a state transition, you locally execute the transition and compare the output to the post-state produced by the block producer. If these differ, the post-state by the block producer was invalid. If you apply this general fraud proof model to Ethereum today, someone could create a transaction that calls many different contracts, and those contracts could each have up to 24kb of bytecode. In order to locally re-execute, you need to provide all the bytecode for all the contracts that were interacted with.
Read more about trust-minimized light clients and sovereignty [here](/docs/about-fuel/the-modular-movement).

## Superior DevEx

Fuel’s technology comes together to provide a superior developer experience. Here’s how we do it:

### Sway and Fuel Toolchain

The FuelVM is designed to be vertically integrated with tooling.

Unlike EVM which was designed without a language from the start, the FuelVM is built alongside its companion language, Sway, ensuring it has handy and efficient ops, such as getting specific parts of a tx. Sway is a Rust-based DSL created specifically to leverage a blockchain VM without needlessly verbose boilerplate. Sway leverages Rust’s safety and catches errors and bugs at compile-time, giving developers peace of mind. Read more about Sway [here](/docs/sway).

Fuel Labs has also developed the Fuel Toolchain: the full stack of tools for enabling/assisting the Fuel application development experience. Read more about the Fuel Toolchain [here](/docs/about-fuel/toolchain).

## Parallel Execution

![parallel transaction execution in the FuelVM](/images/fuel-parallel.png)

Fuel brings scale to Ethereum without sacrificing decentralization.The FuelVM is designed to reduce wasteful processing of traditional blockchain virtual machine architectures, while vastly increasing the potential design space for developers. The FuelVM can use all the threads and cores of your CPU to validate transactions.

## Fuel Configurations

![Fuel configurations](/images/configs.png)

As a Modular Execution Layer, Fuel can function in any one of these categories. Developers can configure Fuel as-needed by switching out a few modules in the client.

## Improved VM

The Ethereum community has suggested many implementation improvements to improve EVM performance. Unfortunately, many of these improvement proposals haven’t been implemented because they would break backward compatibility.

Execution layers built on Ethereum give us a new opportunity to build something better. Designs don’t need to be backward compatible and in fact, can do whatever is necessary to deliver global throughput and adoption for Ethereum. The FuelVM is the EVM greatly improved. Check out this non-exhaustive list of EIPs (Ethereum Improvement Proposals) implemented in the FuelVM [here](/docs/about-fuel).

**The FuelVM and EVM have a lot of overlap. Here's how they're different, view a more complete list at [FuelVM vs. EVM](/docs/about-fuel/fuelvm/vs-evm)**

**The FuelVM has a globally shared memory architecture instead of context-local memory**

The FuelVM has a globally shared memory architecture. Instead of every contract call having its own separate memory space, call data, and return data, all contract call frames share global memory. This chunk of memory is shared amongst all call frames and is globally readable. This allows you to pass data around between contracts without expensive storage and pass chunks of data without having to serialize, copy from call data to memory, etc. Read more about the FuelVM memory model [here](/docs/about-fuel/fuelvm/memory-model).

#### The FuelVM is designed for fraud-provability

The EVM is a complicated machine to construct fraud proofs for. It usually requires a second layer such as WASM or MIPS to be interpreted into a fraud provable system. Check out [User Sovereignty with Fraud Proofs](/docs/about-fuel/fuelvm/fraud-proofs) and [how fraud proofs unlock key functionality](/docs/about-fuel/the-modular-movement).

#### FuelVM has multiple native assets

In Ethereum, the only native asset is Ether. It’s the only one that gets first-class treatment in terms of cost and ability to be pushed and pulled through a call. In Fuel, any contract can mint its UTXO-based native asset using a set of easy asset opcodes. All of which can gain the benefits of native-level call and optimization. Read more about support for multiple native assets in [the Sway docs](/docs/sway/blockchain-development/native_assets).

Read the full specification of the FuelVM [here](/docs/specs/vm). 

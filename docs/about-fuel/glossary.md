# Fuel Glossary

## Address

An address is a cryptographic hash representing an identity of a wallet or a predicate root.

## AssetId

An asset ID is a unique identifier for an on-chain asset. It is derived from the root of the bytecode of the contract minting the asset.

## Base Asset

The base asset is the underlying asset needed to perform any transactions on a blockchain. It is used to pay gas for transactions. On Ethereum, the base asset is ETH.

## Block

A block is a record of many transactions, that are grouped together and cryptographically hashed. The linked blocks form a chain, also called a blockchain.

## Block Explorer

A block explorer is an interface for block and transaction data produced by a blockchain. You can use a block explorer to explore and verify addresses, contracts, and transaction histories.

## Block Height

The block height refers to the total number of valid blocks produced in the history of a blockchain, starting with the genesis block.

## Block ID

A block ID is a unique identifier for a particular block.

## Bridge

A bridge is a mechanism that allows the transfer of data or assets from one blockchain to another.

## Bytecode

Bytecode is machine-readable code, usually generated from a compiler.

## Chain

Another name for a blockchain.

## ChainId

A unique ID for a blockchain.

## Client

The Fuel client refers to the software that runs the Fuel Virtual Machine. It can be used to validate and produce blocks, and send transactions.

## Coinbase

Coinbase refers to the validators paying themselves for processing a block from the transaction fees. Having a coinbase transaction on each block makes this process transparent to all users.

## Consensus

The consensus layer defines the state and validates that all nodes on the blockchain have the same state.

## Consensus Parameters

Consensus parameters are the rules used by clients to determine the validity of and finalize a block.

## Contract Call

Calling a contract means invoking a function from a smart contract that has been deployed to the blockchain.

## Contract ID

The contract ID is a unique identifier for a contract derived from the root of the contract bytecode.

## Data Availability

The data availability layer ensures that block data has been published to the network.

## EIP

EIP stands for Ethereum Improvement Proposal. It refers to a proposal to upgrade the core software powering the Ethereum blockchain.

## EOA

EOA stands for Externally Owned Account. It refers to a wallet address that is not controlled by a contract.

## EVM

EVM stands for Ethereum Virtual Machine, which is the virtual machine used for the Ethereum network.

## Execution

Execution refers to the processing of transactions by nodes in a network.

## Faucet

A faucet is a service that provides free tokens for a testnet.

## Forc

Forc is short for Fuel Orchestrator. Similar to Cargo for Rust, Forc is the build system and package manager for Sway. It is used to build, test, and deploy Sway contracts.

## Fraud Proof

Fraud proofs are a blockchain verification mechanism whereby a claim on a new block is accepted unless a proof the claim is invalid is provided within some configurable time window. Both the Fuel protocol and the FuelVM are designed to be fraud-provable in restrictive environments such as the Ethereum Virtual Machine.

## Fuel

The Fuel blockchain.

## Fuels

Fuels is the name of the Fuel Rust and Typescript SDKs used to interact with a contract, similar to ethers.js or web3.js

## Fuelup

Fuelup is the official toolchain and package manager for the Fuel toolchain.

## FuelVM

The FuelVM is the virtual machine powering the Fuel blockchain.

## Fuel Core

`fuel-core` is the name of the Fuel client implementation.

## Gas

Gas is a variable fee charged by a node to process a transaction that is executed on-chain.

## Indexer

An indexer is a program that watches and organizes blockchain data so it can be easily queried.

## Input

An input refers to a transaction input, which is a UTXO consumed by a transaction.

## Layer 1 (L1)

Also called a level 1, this refers to a base layer blockchain that is not built on top of any other blockchain.

## Layer 2 (L2)

Also called a level 2, this is a blockchain that is built on top of another blockchain. Layer 2 networks can offer unique benefits like allowing for cheaper transactions or sovereign rollups that can fork without forking the base layer.

## Light Client

A light client is a client that doesn't validate blocks and transactions but still offers some functionality to send transactions.

## Locked Wallet

A locked wallet is a wallet that can only interact with read-only smart contract methods.

## Mainnet

Mainnet refers to the main network of a blockchain, as opposed to a testnet.

## Merkle Tree

A Merkle tree is a data structure which uses a cryptographic hash function recursively to condense a set of data into a single value, called the root. It allows efficient proofs that a given element is part of the set.

## Message

A type of input that only includes specific metadata, and is often used for bridging.

## Mint

Minting refers to the creation of new coins.

## Modular

Referring to a blockchain architecture that allows for execution, settlement, consensus, and data availability to run on separate layers.

## Monolithic

Referring to a blockchain architecture that handles execution, settlement, consensus, and data availability all at the same time on a single layer.

## Native Asset

With Fuel any contract can make its own native asset. On Ethereum, the only native asset is ETH. This allows for much cheaper token transactions because it doesn't require any contract state changes. It also allows you to directly forward any asset in a transaction call, avoiding the need for the `approve` and `transferFrom` mechanisms.

## Network

Another name for a blockchain.

## Node

A client that validates and produces blocks for the network.

## Optimistic Rollup

An optimistic rollup is a sidechain that uses fraud proofs to verify transactions instead of relying on a majority of validators to be honest.

## Output

An output refers to a transaction output, or which UTXOs are output by a transaction.

## Parallel Transactions

Parallel transactions refers to the ability of the FuelVM to process multiple transactions in parallel.

## Predicate

A predicate is a pure function that can return true or false, and is sent inside a transaction as bytecode and checked at transaction validity time. If it evaluates to `false` the transaction will not be processed, and no gas will be used. If it evaluates to `true`, any coins belonging to the address equal to the Merkle root of the predicate bytecode may be spent by the transaction.

## Private Key

A cryptographic key that is used to prove ownership by producing a digital signature. It should be kept private (or secret) as it can grant access to a wallet.

## Public Key

A cryptographic key that is generated from its associated private key and can be shared publicly. Addresses are derived from public keys.

## Receipt

A receipt is a data object that is emitted during a transaction and contains information about that transaction.

## Re-entrancy attack

A type of attack in which the attacker is able to recursively call a contract function so that the function is exited before it is fully executed. This can result in the attacker being able to withdraw more funds than intended from a contract.

## Rollup

A rollup is a scaling solution for layer 1 blockchains that "rolls up" or batches transactions as calldata.

## Script

A script is runnable bytecode that executes once on-chain to perform some task. It does not represent ownership of any resources and it cannot be called by a contract. A script can return a single value of any type.

## Settlement

Settlement refers to how and where on-chain disputes are resolved or settled.

## Sidechain

A sidechain is a blockchain that runs independently but is connected to another blockchain (often Ethereum Mainnet) by a two-way bridge.

## Signature

A cryptographic signature from a wallet, usually in reference to a signature for a message.

## Smart Contract

Also referred to as a contract, a smart contract is a set of programming functions with persistent state that is deployed on a blockchain. Once deployed, the contract code can never be changed or deleted, and anyone can access public functions without permission.

## State Channel

State channels allow for users to conduct any number of off-chain transactions while only submitting two on-chain transactions to open and close the channel. This reduces the number of on-chain transactions needed, which reduces the cost and saves time.

## Sway

Sway is the official programming language for Fuel. It is a domain-specific language crafted for the FuelVM and inspired by Rust.

## Testnet

Testnet is short for test network. You can use a testnet to deploy and test contracts for free.

## Toolchain

A toolchain is a set of related tools. The Fuel toolchain includes `fuelup`, `forc`, `fuel-core`, and `fuels`.

## Transaction

A transaction is any interaction with the blockchain, for example sending coins from one address to another.

## Unlocked Wallet

An unlocked wallet can interact with both read and write smart contract methods.

## UTXO

UTXO stands for unspent transaction output.

## UTXO Model

A UTXO model is a blockchain model that doesn't keep track of account balances. Instead, it uses inputs and outputs to manage state, which allows for fast parallel transactions.

## Validator

A validator refers to a network validator or node. Validators help validate transactions and produce blocks.

## Witness

A witness refers to the cryptographic signatures from actors involved in authorizing a transaction, including the transaction signers, contract callers, and block producers.

## Zero-Knowledge Proof

A method that allows for the verification of secret information without revealing the secret.

## Zero-Knowledge Rollup

A rollup that uses zero-knowledge proofs to verify transactions. In ZK rollups, each rollup block posted to the contract must be accompanied by a validity proof (a succinct proof that the block is valid), which is also verified by the contract. Blocks are thus finalized immediately, and withdrawals can be processed in the same Ethereum block.

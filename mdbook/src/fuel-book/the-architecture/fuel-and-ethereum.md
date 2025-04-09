# Fuel and Ethereum

Highlights:

- Fuel Ignition leverages Ethereum as its Layer 1 for settlement and data availability, aligning with Ethereum's core values of sustainability, security, and accessibility for everyday users. This choice emphasizes Fuel's commitment to building a long-term, decentralized ecosystem.

- By utilizing one of the most established and decentralized Layer 1 networks, Ethereum provides a robust foundation for Fuel’s rollup, ensuring reliable performance and security. Fuel's rollup inherits Ethereum's security model, which safeguards user funds and enables fraud-proof mechanisms directly on the Ethereum blockchain.

- Fuel allows seamless messaging between Layer 1 and Layer 2, ensuring that any message sent to Ethereum must be processed on Fuel and vice versa. This capability enhances user experience and guarantees censorship resistance.

- Users can easily deposit and withdraw ETH, transferring assets between Layer 1 and Layer 2. They can deposit ETH directly to Fuel and initiate withdrawals by burning tokens on Layer 2, with the system ensuring timely and secure processing.

- Fuel actively pursues innovation through techniques like hybrid proving, optimizing the proving system by reducing complexity and shortening challenge windows. By embracing a modular tech stack, Fuel remains adaptable, exploring integration with alternative Layer 1s and data availability solutions to enhance its ecosystem.

Fuel Ignition uses Ethereum as a Layer 1. We chose Ethereum as Fuel’s L1 for both Settlement and Data availability of the L2, because we think Fuel shares many of Ethereum’s values:

- Building for long-term sustainably

- Building with an emphasis on security

- Focus on consumer hardware and making participation in the protocol accessible  for ordinary people

Ethereum is one of the most decentralized L2s. Ethereum has a long-standing presence and has focused on a rollup-centric roadmap for years. These factors make it the ideal foundation for building a rollup.

![2.5 Fuel and Ethereum](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.5-fuel-and-ethereum-light.png)

## Inheriting Ethereum’s Security

Fuel’s flagship rollup, Ignition, inherits Ethereum’s security. The natural question from the previous statement is, what do we mean by inheriting Ethereum’s security?

Fuel uses Ethereum as the layer to keep users’ funds and propose its latest blocks and corresponding state updates. We deploy smart contracts that continuously get updates of Fuel Layer 2.

Then, we have fraud-proving performed directly on the Ethereum L1 to prove that something about the posted blocks or related state updates is wrong. We also allow permissionless messaging and transaction inclusion via the L1 to ensure the user doesn’t experience any censorship resistance.

This gives the user guarantees that as long as Ethereum is secure and the honest majority assumption for it is held:

- No fraud blocks or state updates can be sent
- Their funds are always safe on the Layer 1
- They can never be stopped from withdrawing them or being able to send any transaction to the L2 (forced inclusion)

Now, we will discuss each of the properties we described above.

## Messaging

Fuel allows for messaging between L1 → L2 and L2 → L1, which means you can send any arbitrary message from Layer 1 to Layer 2 and vice versa. The protocol guarantees that if a message is included in the L1, it has to be processed on the L2 and vice versa. Let’s discuss both of these cases individually.

### L1 → L2 Messaging

The [Fuel Message Portal](https://github.com/FuelLabs/fuel-bridge/blob/main/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol) facilitates message processing from L1 -> L2. Its method, [sendMessage](https://github.com/FuelLabs/fuel-bridge/blob/6030a40ce9c58a533c09f73e837f85ab4784ef58/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L250), accepts the L2 recipient (a Fuel Address) and the corresponding message to be sent. After a successful call to this method, a [MessageSent](https://github.com/FuelLabs/fuel-bridge/blob/6030a40ce9c58a533c09f73e837f85ab4784ef58/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L49) event is emitted on Layer 1.

As discussed in the section on block building, part of processing the Fuel blocks requires committing to some L1 block height, up to which the block builder processes messages and transactions, this forces the Block builder to include all messages from the L1 (as in case of failure, the builder can be slashed).

![2.5 L1 → L2 Messaging](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.5-l1-l2-messaging-light.png)

As part of processing the message blocks from the L1, the block builder looks at the event and mints an OutputMessage transaction to the particular Fuel address with the specific data.

### L2 → L1 Messaging

Fuel also allows messages from the L2 -> L1 to be sent using [MessageOut](https://github.com/FuelLabs/fuel-specs/blob/master/src/abi/receipts.md#messageout-receipt) receipts. Every Fuel block includes a receipt root, the root of all receipts that were part of the block. This allows anyone to make a call to the [relayMessage](https://github.com/FuelLabs/fuel-bridge/blob/6030a40ce9c58a533c09f73e837f85ab4784ef58/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L188) function of the Fuel Message Portal; a Merkle proof of inclusion is required to perform for the message you are trying to process along with that, it checks whether the block for which the message is being processed has been finalized or not (i.e., it outside of the challenge window).

![2.5 L2 → L1 Messaging](https://raw.githubusercontent.com/FuelLabs/fuel-book/refs/heads/main/assets/2.5-l2-l1-messaging-light.png)

Processing the message on the L1 coming from the L2 is done by calling the specific L1 address to which the message is sent to with some desired payload.

## ETH Deposits and Withdrawals

A core part of using the Fuel rollup is depositing ETH from the L1 to Fuel and withdrawing it from the L2. We will discuss both of these scenarios individually.

### ETH Deposits

The user can call the [depositEth](https://github.com/FuelLabs/fuel-bridge/blob/6030a40ce9c58a533c09f73e837f85ab4784ef58/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L256) function on the L1 to create a deposit. The method is payable, and emits a [messageSent](https://github.com/FuelLabs/fuel-bridge/blob/6030a40ce9c58a533c09f73e837f85ab4784ef58/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L49) event with an empty payload, this makes the sequencer recognize this is a deposit made on the L1 and it mints a new eth coin corresponding to the value of the deposit for the user.

### ETH Withdrawals

Withdrawals on the L2 are made by burning the tokens on the L2 via the [L2 gateway](https://github.com/FuelLabs/fuel-bridge/blob/main/packages/fungible-token/bridge-fungible-token/implementation/src/main.sw#L147). Then, the gateway emits a [MessageOut](https://docs.fuel.network/docs/specs/abi/receipts/#messageout-receipt) receipt, which is part of the block header, allowing the relay of this message to Layer 1.

The Layer 1 [Message Portal](https://github.com/FuelLabs/fuel-bridge/blob/de18552d4a23c6ec1477c6532732dbcdc05a8c16/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol) contract has a [relayMessage](https://github.com/FuelLabs/fuel-bridge/blob/de18552d4a23c6ec1477c6532732dbcdc05a8c16/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol#L188) function (read [L2 → L1](#l2--l1-messaging) messaging for details); which allows for processing L2 messages aimed for L1, in the case of withdrawals, we send a message with the amount corresponding to the value the user has burned on the L2, and hence the [Message Portal](https://github.com/FuelLabs/fuel-bridge/blob/de18552d4a23c6ec1477c6532732dbcdc05a8c16/packages/solidity-contracts/contracts/fuelchain/FuelMessagePortal.sol) contract provides the L1 recipient with their funds for withdrawal.

Note: A withdrawal requires the '[Challenge Window](#challenge-window)' to be cleared before being processed, and hence the user has to wait till the 'Challenge Window' (although there are [fast finality gadgets](http://ethresear.ch/t/why-wait-a-week-fast-finality-optimistic-rollups/18868) which can bring this down.)

## State Updates

Fuel uses Ethereum to submit new state updates. This is done using the [State Contract](https://github.com/FuelLabs/fuel-bridge/blob/main/packages/solidity-contracts/contracts/fuelchain/FuelChainState.sol) on Layer 1, where the blocks are committed by sending the block hash and block height. The contract also records the timestamp as part of the commitment for a particular block.

These state updates and the data posted as Blobs on Ethereum allow for challenging any state updates sent to the L1.

## Challenge Window

The challenge window is the time it takes for a block and related state posted on the L1 to be considered finalized. Finalization means any withdrawal or message part of this block can be processed on the L1. For now, the challenge window for Fuel is seven days.

Techniques like hybrid proving and other fast finality gadgets can reduce the duration of the challenge window; we are actively researching these areas and would encourage you to read [Nick Dodson’s post](http://ethresear.ch/t/why-wait-a-week-fast-finality-optimistic-rollups/18868) on faster finality gadgets for optimistic rollups.

## Hybrid Proving

Fuel believes in a philosophy of [zk-pragmatism](../why-fuel/the-fuel-way.md#zk-pragmatism); rather than playing bisection games on-chain like other rollups (which increase the complexity of the proving system)  or sending zk proofs for every bath like zk rollups (which increase the cost per transaction), Fuel makes a hybrid approach for its proving system.

The system runs in an optimistic setting. If someone in the system believes that a fraud state has been sent, they create a zk-proof off-chain of the claim and prove fraud in a single interaction with the L1. This reduces the proving system's complexity and limits the challenge window.

Hybrid proving is being developed, and prototyping is done with RISC-V-based zkVMs like SP-1 and RISC-0. You can read more about the proving system [here](https://fuel.mirror.xyz/gY0Clw114Ipnel1Bhrey9LCsxX94ly3I9yAfnSWYWTg).

## Appendix

### Alt-DAs and L1s

We have launched our flagship rollup with Eth as our L1 for settlement and data availability, but Fuel believes in creating a neutral and modular tech stack. The Fuel tech stack can be extended to launch on alt L1s like Bitcoin and Solana and with alt DAs like Celestia and Avail. If someone wants, they can even use the Fuel stack to launch their L1.

We will keep progressing our tech stack to be adaptable in multiple scenarios, resilient, and feasible on consumer-grade hardware.

### Blobs

EIP 4844 introduced Blobs as a cheaper way to get Data Availability for Ethereum rollups. Fuel block builders also use blobs, although this is a work in progress.

Fuel blocks are batched together in a bundle, compressed via popular techniques (gzip or zstd), and posted as blobs. Because blobs are fixed in size, uploading has to be done via a series of transactions.

Blobs and their exact implementation are still being finalized and will be live soon, but the above text summarizes the general approach for now.

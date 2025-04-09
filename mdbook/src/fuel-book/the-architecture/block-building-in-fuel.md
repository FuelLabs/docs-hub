# Block Building in Fuel

Highlights:

- The Block Builder plays a pivotal role in block building within Fuel by processing messages and transactions, constructing blocks, and submitting them to Layer 1 while ensuring soft-finality on Layer 2.

- The Fuel Block Builder uses a messaging system to facilitate the transfer of information between Layer 1 and Layer 2, enabling both regular transactions and forced transaction inclusion. This feature empowers users to bypass potential censorship by relaying their transactions directly from Layer 1.

- To guarantee reliable processing of messages and transactions, the Block Builder appends a data height (da_height) to each block, linking it to a specific Layer 1 block. By utilizing Merkle trees to store commitments, the system ensures that all events are processed in a deterministic manner, allowing for transparent validation and slashing of the Block Builder if necessary.

- The Block Builder also processes local transactions, allowing users to send transactions directly to it for more efficient batching and compression. This method reduces transaction costs and accelerates soft finality, providing users - with quicker confirmations compared to traditional Layer 1 submissions.

- The Block Builder determines transaction ordering and manages miner extractable value (MEV) in Fuel. It prioritizes transactions based on the tips provided, contrasting with the first-in-first-out approach found in many other Layer 2 solutions, which optimizes user incentives within the network.

This section focuses on block building in Fuel and the role that the Block Builder plays in this process.

The Fuel Block Builder is a component in Fuel rollups, which is responsible for:

- Processing messages from L1 → L2

- Processing transactions in the mempool

- Building blocks and submitting them to the Layer 1

- Providing soft-finality on the Layer 2

## L1 → L2 processing

Fuel rollups have a messaging system (from L1 → L2 and vice versa), which we will discuss further in the next section on bridging. In addition to relaying bridge messages, this system allows transactions to be sent directly from L1, which is used for forced transaction inclusion.

The Fuel Block Builder uses a relay to receive messages and transactions from L1 → L2, we will discuss both of these cases individually now.

### L1 Messages

Block Builder receives relayed messages from Layer 1 emitted as L1 events. The message is then picked up as part of the block-building process; each message sent from the L1 has the following format:

| name      | type      | description                                                  |
|-----------|-----------|--------------------------------------------------------------|
| sender    | bytes[32] | The identity of the sender of the message on the L1          |
| recipient | bytes[32] | The recipient of the message on the Fuel Blockchain          |
| nonce     | bytes[32] | Unique identifier of the message assigned by the L1 contract |
| amount    | uint64    | The amount of the base asset transfer                        |
| data      | byte[]    | Arbitrary message data                                       |

The block builder creates an output of type `OutputMessage`, and after creating this output, it completes the message processing.

Applications can leverage these `OutputMessage(s)` as they see fit. One example is the deposit process, where the bridge contract mints new ETH on the L2 after receiving specific messages that prove deposits on the L1 (we will discuss this further in the next section).

### L1 Transactions and Forced Inclusion

Fuel provides forced inclusion of transactions. If a user feels the L2 block builder is attempting to censor, they can emit a serialized transaction from the L1 as an event, forcing the L2 block builder to include the transaction in the block building. This process, called “Forced Inclusion,” guarantees user censorship resistance.

The Fuel transactions sent from L1 are emitted as events via the L1 and have the following format:

| name                   | type      | description                                                        |
|------------------------|-----------|--------------------------------------------------------------------|
| nonce                  | bytes[32] | Unique identifier of the transaction assigned by the L1 contract   |
| max_gas                | uint64    | The maximum amount of gas allowed to use on Fuel Blockchain        |
| serialized_transaction | byte[]    | The serialized transaction bytes following canonical serialization |

Forced Inclusion allows the processing of all transaction types except `Mint`, which can only be created by the Fuel Block Builder. This exception does not restrict security guarantees for users' censorship resistance.

### Guarantees around L1 processing

How does the L2 guarantee it will always process messages or transactions sent from L1?

This is done by appending the `da_height`, i.e., the L1 block up to which the current block processes messages and transactions. A commitment for all the events and transactions is stored as part of the block header, using a Merkle tree and its root.

All events from L1 → L2 (both inbox messages and forced transactions), are ordered by their block number and the index in that block. Following this order allows us to find a deterministic way of creating this Merkle tree.

We create this Merkle tree and store the root in the `event_inbox_root` field as part of the block header.

Fuel blocks are subject to later challenges. If it's proven that a specific message or transaction was omitted or not processed, the responsible block builder can be penalized.

## Processing Local Transactions

Apart from processing messages and transactions from L1 → L2, the Block Builder is responsible for processing transactions sent to it locally. Users can send transactions to the Block Builder locally, collected in its Mempool, and then processed and sent to Layer 1.

By using clever batching and compression techniques (gzip or zstd) this system offers users lower transaction costs compared to direct Layer 1 submissions.

Another advantage of sending transactions directly to the Block Builder is getting faster soft finality on the L2. For a transaction sent via L1 to be processed, the L1 block must be finalized first.

## Block Building and Proposing

The Fuel Block Builder is required to bundle transactions into blocks and propose them to Layer 1 as part of processing transactions. Committed blocks on Fuel enter a ['Challenge Window'](./fuel-and-ethereum.md#challenge-window) after commitment. Once this window closes, the block and its corresponding state are considered to have reached 'L1 finality'.

Fuel Block Builder currently sends the block hash and block height as new updates to the onchain message portal, along with blobs containing transactions and other data,  to provide DA for that specific block.

## Transaction Ordering and MEV

The current Fuel Block Builder decides the priority of a transaction by sorting with `tip/max_gas`, which means unlike many other L2s, the network isn’t FIFO (First In First Out); this also means that in Fuel, the Priority of your transaction inclusion is:

- Directly proportional to the `tip` you provide as part of the transaction

- Inversely proportional to the `max_gas` you permit for your transaction

## Soft Finality

The Block Builder also plays a major role in providing soft finality for L2 transactions. As an L2 participant, you can choose the level of finality at which you're comfortable making business decisions.

When the Block Builder orders and processes your transaction, it provides a soft finality. This can be considered confirmed unless the Block Builder fails to finalize it on L1.

## Appendix

### Full Nodes

The [fuel-core](https://github.com/FuelLabs/fuel-core) software also allows you to run a Full Node. A Full Node collects the latest updates on Layer 2 from the peers and broadcasts incoming transactions to the network.

Full Nodes cannot build blocks; instead, they receive them as updates via p2p and re-execute them locally to maintain the correct state with complete verification.

By running the Full Node, you can, as a user, be given the ability to keep verifying the L2 yourself and, hence, also be able to send fraud proofs. You also get your own GraphQL endpoint, which can broadcast your transactions to the network.

All Fuel GraphQL providers run Full Nodes themselves to provide you with the latest Fuel state and allow you to broadcast transactions.

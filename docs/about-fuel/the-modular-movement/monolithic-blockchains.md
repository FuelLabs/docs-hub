# Monolithic Blockchains

Blockchains as we know them have four functions. In no particular order:

- Execution: Execute transactions to make updates to the state.
- Settlement: Dispute resolution.
- Consensus: Defines the state and validates that all nodes on the blockchain have the same state.
- Data availability: Ensure block data has been published to the network.

Monolithic blockchains are a type of blockchain architecture that handle all four functions, at the same time, on this single layer.

![monolithic](/images/monolithic.png)

## Challenges with Monolithic

Some constraints and challenges with a monolithic architecture:

### Costly and inefficient transaction verification

In order to verify the validity of transactions in the chain, full nodes must download the entire chain and execute each transaction locally.

### Resource constraints

The blockchain is bound by the resource capacity of its nodes. Throughput is constrained by the resource requirements of a _single_ node since the blockchain is replicated, not distributed, across nodes.

### Shared resources

In a monolithic architecture, the four functions of the chain operate on the same finite set of compute resources. For example, using a node's capacity for execution means that there's less capacity left over for data availability.

### Scalability

Scalability is defined as the ratio of throughput to decentralization. To increase throughput—the number transactions per second—you have to increase bandwidth, compute, and storage capacity, which pushes up the cost to run a full node as a user. This is not scalability, as it reduces the number of people who can run a full node to validate the chain.
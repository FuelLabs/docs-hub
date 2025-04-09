# State Rehydration

Typical blockchain applications treat the chain’s state as a large, public, distributed database. These applications write data to the chain in a similar manner to how a Web2 application would write to a cloud-hosted database.
However, this imposes a large burden on the network, which must maintain this data on all nodes. The immutable nature of blockchains means this data is generally stored forever.

Fuel aims to address this issue using a technique known as “state rehydration”. This technique uses the blockchain as a system for maintaining consensus over state commitments, as opposed to a system for syncing a large database.

Specifically, this technique takes advantage of the fact that “calldata” and hashing are relatively inexpensive compared to state storage. State rehydration means that a transaction includes all the state data needed for an action, and this state will be validated against a single on-chain hash as a state commitment. In turn, an application will update the state by hashing the new state values, storing this “dehydrated” commitment in state, and emitting the full state in a log so it can be made available off-chain.

Many current parts of Fuel are considered “state rehydration”, such as predicates which require users to provide the account’s bytecode. Furthermore, some applications have taken state rehydration a step further, using UTXOs and predicates to provide further state reductions.

However, Fuel’s roadmap aims to bring state-rehydration to a level where it can power any arbitrary blockchain application. This requires a full integration between users, block-builders, and off-chain indexers, allowing various parties to pay to reconstruct the state in a completed block. This technique will leverage Fuel’s planned decentralized block-building mechanisms.

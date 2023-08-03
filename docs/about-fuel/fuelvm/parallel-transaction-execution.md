# Parallel Transaction Execution

Ethereum processes transactions sequentially (i.e. one after the other). With modern processors becoming increasingly multi-threaded but stalling on single-core speedups, being able to execute transactions in parallel (i.e. multiple transactions at once) is a highly desirable property.

Without a mechanism for determining and handling [dependencies](https://en.wikipedia.org/wiki/Parallel_computing#Dependencies) between transactions, executing transactions in parallel is a race condition and would result in non-deterministic execution. There have been attempts to add [optimistic concurrent execution](https://arxiv.org/abs/1901.01376) logic to Ethereum, but show inconsistent performance benefits and moreover only work in non-adversarial conditions.

[EIP-648](https://github.com/ethereum/EIPs/issues/648) proposed to add _access lists_ to transactions, i.e. a list of shared state that would be touched by each transaction. With such a list, clients can partition transactions into sets with disjoint access lists and execute transactions across each set in parallel. However, the EIP was never implemented, in part due to implementation and design inefficiencies that resulted in state accesses being the bottleneck rather than compute.

## State Access Lists and UTXOs

Fuel supports parallel transaction execution through strict (i.e. mandatory) access lists, similar to EIP-648. Each transaction must specify which contracts the transaction _may_ interact with; if a transaction attempts to access a contract not in this list then execution will _revert_. With these access lists, execution can be done in parallel across transactions that touch disjoint sets of contracts. See [here](/docs/specs/protocol/tx-validity/#access-lists) for additional context.

Access lists are implemented with UTXOs. UTXOs give other nice properties, but for the purposes of parallel transaction execution serve simply as [strict access lists](https://forum.celestia.org/t/accounts-strict-access-lists-and-utxos/37).
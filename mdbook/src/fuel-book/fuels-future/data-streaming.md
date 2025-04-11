# Data Streaming

While many projects have focused energy on improving the performance of writing data to blockchains, less attention has been paid to optimizing how to read data from a blockchain. In the future, Fuel will radically restructure how data gets propagated from block-producers out to the various end-users of a network.

Current blockchain applications read data from a network by repeatedly “pinging” an RPC node, asking that node to provide the current state of the network and then checking for updates locally. This method of “polling” for new data is extremely inefficient for all parties, placing computational and network burdens on both the client and server. Furthermore, the “pull” nature of this system means that there will always be some extra latency introduced into the transaction. And in the world of finance, time is money.

Fuel aims to flip the data model on its head, creating a push/subscription model of disseminating data across a network. Fuel will enable block-producers to stream every phase of the transaction supply chain from their own servers, out through a network of lightweight relayers, on to end users. This allows users to have fast access to blockchain data without requiring unnecessary “polling”, and allows financial actors to have the fastest access to the financial information they care about.

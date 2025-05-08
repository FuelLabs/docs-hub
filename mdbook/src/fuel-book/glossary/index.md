# Glossary

**Contract:** Primitives allowing for building stateful applications on Fuel, facilitates complex stateful applications like AMMs, Vaults, etc.

**Context:** Provides policies that determine what features can some running FuelVM bytecode use, for example the ability to call smart contracts, use persistent storage, etc.

**Cryptography:** The practice of securing information and communications through mathematical techniques, ensuring data confidentiality, integrity, and authenticity in blockchain systems.

**Ephemeral scripting:** Scripts or code that are temporary and designed for short-term, single-use purposes. These scripts are typically used for tasks that do not require persistent state or long-term execution and are often discarded or removed after they fulfill their function.

**Ethereum Virtual Machine (EVM):** A decentralized computing environment that executes smart contracts on the Ethereum blockchain.

**Finality:** The point at which a transaction is considered permanently recorded on the blockchain and cannot be altered or reversed, providing assurance that it is completed.

**Forc:** A command-line toolchain that serves as the backbone of Fuel development. It supports everything from compiling Sway smart contracts to managing dependencies and deploying applications.

**Fuel Ignition:** Will be the first Fuel V2 rollup to go live on Ethereum Mainnet. It aims to surpass traditional EVM rollups by delivering a vastly improved execution design.

**Fuel Rust SDK:** A developer tool that allows developers to interact with Fuel’s blockchain using the Rust programming language. It offers a seamless experience for creating system-level applications and managing interactions with the Fuel Network.

**Fuel Typescript SDK:** A developer tool that allows developers to integrate Fuel into web applications. It simplifies interaction with the Fuel blockchain, making it easy for frontend developers to build decentralized applications that interact with Fuel’s infrastructure.

**Fuel Virtual Machine (FuelVM):** A high-performance execution environment for the Fuel Network that enables parallel transaction processing, achieving up to 21,000 transactions per second per core. It optimizes resource use and minimizes demands on full nodes, enhancing network sustainability and decentralization.

**Fuel Wallet SDK:** A developer tool that provides developers with the tools to create secure, user-friendly wallets that natively interact with the Fuel ecosystem. It ensures developers can easily build wallets that integrate into decentralized applications.

**Interoperability:** The ability of different networks to communicate and exchange assets or data seamlessly, enabling cross-chain functionality without intermediaries.

**Layer 1:** A base blockchain network (e.g., Bitcoin, Ethereum) responsible for processing and finalizing transactions directly on its ledger.

**Layer 2:** An off-chain scaling solution built on top of a Layer 1 blockchain to improve transaction speed and reduce costs while still relying on Layer 1 for security and finality.

**Merkle Tree:** A data structure used in blockchains to efficiently and securely verify large sets of transactions, by organizing them into a tree-like structure where each node is a cryptographic hash of its children.

**Native Assets:** Cryptocurrencies or tokens that are built into and exist directly on a blockchain, serving as the primary currency for that network.

**Optimistic Rollup:** A Layer 2 scaling solution that processes transactions off-chain while assuming they are valid by default, requiring participants to challenge fraudulent transactions within a specific time frame. If no challenges are made, the transactions are considered valid and finalized on the Layer 1 blockchain.

**Parallelism:** The ability to process multiple transactions simultaneously.

**Predicate:** A stateless smart account that allows transactions to execute in parallel without conflict.

**Proposer-Builder Separation (PBS):** Proposer-builder separation (PBS) is an Ethereum concept designed to enhance network scalability and security by splitting block building responsibilities into two distinct roles: block proposers and block builders.

**Rollup:** A Layer 2 scaling solution that batches multiple transactions into a single one and processes them off-chain, while still ensuring security and finality on the Layer 1 blockchain.

**Scalability:** The capability of a blockchain to handle an increasing number of transactions or users without compromising performance, security, or decentralization.

**Script:** Entrypoint for fuel transactions which dictates what happens as part of a Fuel transaction.

**State:** All the data a blockchain needs to store and maintain.

**State Tree:** A data structure used in blockchains to represent the current state of all accounts, smart contracts, and their balances. It allows for efficient storage and retrieval of state information, often enabling quick verification and updates during transaction processing.

**Sway:** a domain specific language (DSL) for modern blockchain programming which has familiar syntax, grammar and design ideology to Rust while incorporating blockchain specific functionality such as smart contract interface concepts.

**Throughput:** The number of transactions a blockchain can process within a given time frame, often measured in transactions per second (TPS).

**Unspent Transaction Output (UTXO):** The model used for tracking asset ownership, contracts, messages and transactions.

**Virtual Machine (VM):** An environment that executes smart contracts on a blockchain, enabling developers to run code in a decentralized manner without needing to interact with the underlying hardware.

**Zero Knowledge:** A cryptographic method that allows one party to prove to another that they know a value without revealing the value itself or any other information.

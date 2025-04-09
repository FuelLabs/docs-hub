# Security on Fuel

Highlights:

- Fuel emphasizes security across its rollup ecosystem, particularly through its Security Council, which operates multi-signature wallets to oversee and upgrade various components of the stack. This council plays a critical role in safeguarding the network as Fuel navigates its transition to a fully permissionless system.

- The project recognizes the current centralization of block building and sequencing as a challenge. To address this, Fuel plans a phased approach to decentralize these processes, beginning with a shared sequencer accessible to all block builders before moving towards fully decentralized block building.

- Fuel proactively identifies and mitigates potential security attack vectors, including bugs in bridge contracts, Layer 2 client implementations, and the Sway compiler. By collaborating with diverse teams and engaging top security organizations, Fuel works to establish robust security protocols and multiple implementations to reduce the likelihood of vulnerabilities.

- The platform also tackles application-level bugs by developing secure support libraries in Sway and promoting best practices among developers. This focus on security fosters a more resilient ecosystem for application development.

- Fuel continuously upgrades its protocol to further enhance security, reducing reliance on the Security Council and minimizing risks associated with multi-signature compromise. The project also prioritizes rigorous auditing and testing of fraud-proving implementations to protect against false claims and ensure that legitimate builders receive fair treatment.

This section discusses the current security of Fuel Ignition and rollups.

## Fuel Security Council

Fuel currently has a security council that operates various multi-sigs to upgrade different parts of the stack.

Rollups are in an early stage of development, necessitating a security council to exercise caution before full decentralization. Network issues can be difficult to resolve, making this oversight crucial.

Developing a stack with type-2 security guarantees is a top priority in Fuel's roadmap.

## Block Building

Currently, block building and sequencing are centralized. Decentralizing these processes, especially block building, requires further development and careful consideration. Block building rights give the builder access to extract MEV from the system, which can impact user’s transactions and experience on the network.

Fuel is implementing a phased approach to decentralize block builders and sequencers.

Fuel will start with a decentralized sequencer set, i.e., a shared sequencer that block builders can use for all Fuel rollups. Decentralized block building will follow in the next phase.

## Security Attack Vectors

In this section, we list various attack vectors for the current system and we explore a path forward to tightening security.

### Bridge Contract Bugs

Fuel has a bridge that allows for messaging between L1 and L2; this messaging system creates the base for building a deposit and withdrawal system along with abilities like forced transaction inclusion and calling contracts L2 on L1.

If a bug in the contract implementation on the L1 or L2 compromises the roll-up system, which can include relaying fake messages and transactions from the L1 and L2. A compromise of the mult-sig can also lead to potential malicious upgrades of these contracts.

Fuel undergoes rigorous audits of its smart contracts with the best-in-class security auditors in the space and also participates in bug bounties to keep the possibility of this very low. These issues become more concerning in stage 2 settings, as the stage 1 setting does allow for reverting potential issues regarding bridge contracts.

### Layer 2 Client Bugs

Like any software, the Fuel execution client could have bugs that might be exploited to enable unintended behavior. If there is only one implementation of the execution client, a malicious actor might manipulate the system without being caught by a fraud-proof mechanism, as no alternative client would exist to validate or challenge the state. This risk is particularly relevant in L2 solutions that rely on a single execution client for ZK proving games or fraud-proof verification, making it a potential attack vector.

Fuel attempts to strengthen security around such scenarios by inviting various teams to collaborate on the stack and aiming for multiple implementations, followed by rigorous testing and security audits by the best security organizations in the industry.

### Sway Compiler Bugs

The Sway Language is a dominant language built on the Fuel VM. A bug in the Sway compiler could allow malicious bytecode to be part of a particular predicate, smart contract, or script, which the implementation didn’t desire. A similar issue was seen in the ETH ecosystem with Vyper, which you can follow [here](https://medium.com/rektify-ai/the-vyper-compiler-saga-unraveling-the-reentrancy-bug-that-shook-defi-86ade6c54265).

Fuel aims to avoid such a scenario by having some of the best talent working on its compiler, followed by rigorous testing and audits by leading security organizations in the industry. In the future, we also aim to have multiple implementations of the compiler, which could help discover a bug in the other implementations.

### Application Level Bugs

Application implementations often have bugs because they avoid some required checks or are built on top of libraries with an underlying bug.

Fuel aims to avoid these by creating best-in-class support libraries in Sway, which are well-audited and tested and safe to build on. These Sway libraries also promotes the usage of secure patterns through developer evangelism.

### Multisig Compromisation

If compromised, the security council's multi-sig can lead to severe issues, such as malicious upgrades or behavior in various parts of the stack.

Fuel aims to solve this by having a security council with a very high reputation and a lot of social capital attached to it. At the same time, continuous protocol upgrades minimize the need for the security council and always accelerate towards allowing for a stage 2 rollup stack.

### Fraud Proving Bugs

A bug in the fraud-proving implementation can cause challenges and slash for block builders who built correct blocks or could allow someone to fail to prove a faulty block. This can result in good builders being slashed or wrong states being finalized.

Fuel aims to solve this by initially correcting any such issues with the help of the security council while aiming for multiple implementations of the fraud-proving client or, if possible, multiple-proving system. The implementation is done with best security practices in mind and with regular system audits.

# The Fuel Way

Blockchains have largely followed Ethereum's evolutionary path since its launch.

Subsequent chains tout increased speed, scalability, power, and usability. They implement novel consensus mechanisms, databases, and ZK proving systems.

Despite these innovations, the core system remains largely unchanged: developers craft smart contracts for applications and assets (typically in Solidity or Rust). Users rely on centralized servers to read on-chain data and interact by signing messages with a standard private key, then routing these signed messages back through the same centralized servers.

Fuel charts a new course for the blockchain industry, prioritizing decentralization at its core. We're not just iterating; we're rebuilding blockchain architecture from the ground up.

## Decentralized… Sustainably Decentralized

Blockchains fundamentally consist of a network of distributed nodes, all validating new blocks and transactions. The ability for independent, distributed and unqualified actors to participate in this process is what gives blockchains their valuable properties of liveness, censorship resistance and verifiability.

Bitcoin continues to take the most principled stance on maintaining these properties. The low node requirements and low bandwidth usage mean that Bitcoin full nodes can be run on devices as light as Raspberry Pis, and in locations as remote as outer space.

However, subsequent blockchains have all made ongoing compromises. Most newer blockchains today (including most layer-2s) can only be run on high-powered servers with data-center connections. And some high throughput projects remove the key cryptographic primitives of verifiability, such as the merkelization of state elements.

Fuel aims to pull the blockchain space back from this creeping centralization, back towards the values of Bitcoin. The Fuel architecture allows for high performance, while still running on consumer hardware. Fuel always maintains the property of cryptographic verifiability, allowing users to check the state of the chain without trusting third parties.

## Blockchains are not Computers

Advancing blockchain technology demands more than incremental upgrades. True innovation often requires revolutionary action– including breaking changes. Fuel envisions revolutionizing both blockchain architecture and application development to unlock the technology's full potential.Traditional smart-contract platforms mimic computer systems, with blockchains serving as hardware and smart contracts as software. These contracts execute read and write operations, storing data to the chain's state—effectively treating it as a global Postgres database.

Fuel believes that blockchains are not simply scaled-up abstract mainframes but a different kind of computer—"trust machines." These machines are still programmable, but they operate under vastly different constraints than traditional execution environments. The role of a blockchain node is not to act as a cloud server but to verify the current state of the chain and all future state transitions with trustless integrity.

Moving computation off blockchain full nodes and shifting data outside of the blockchain’s state keep full node requirements low, allowing blockchains to scale without centralizing. Fuel enables developers to build smart applications without smart contracts, simplifying development while maintaining the decentralized ethos of blockchain technology.

## ZK Pragmatism

Zero-knowledge technology has captured the imagination of researchers and developers from across the blockchain industry. The promise of succinct verification for arbitrary computation has opened up a whole new range of possibilities for scaling blockchains, making them verifiable, interoperable, and more. The thesis of building the future of ZK-powered blockchain tech has driven some of the most anticipated and well-funded projects in this space.

Fuel adopts a pragmatic approach to zero-knowledge (ZK) technology while recognizing its groundbreaking potential within and beyond blockchains. We share the industry's excitement about these new primitives and are actively integrating ZK technology into the Fuel stack  (such as in Fuel’s hybrid-proving model and with the service chain’s ZK-powered bridge).

Fuel asserts that blockchain security, high performance, and interoperability should not hinge on ZK technology alone. Fuel pioneered the first optimistic rollup on Ethereum, diverging from the prevalent focus on ZK rollups among Ethereum scaling solutions. Fuel maintains that full ZK-verification cannot sustainably meet the market's stringent cost and performance demands.Proof generation costs and time constraints render fully ZK-proven chains incompatible with both cost-effectiveness and high-speed operations. Sustainable proofs and 'real-time proving' typically rely on ZK-specific hardware, which faces numerous production-readiness hurdles.

Fuel crafts cutting-edge blockchain technology, selectively integrating off-the-shelf ZK solutions to enhance its stack. The rise of generalized ZK-VMs like RISC Zero and Succinct’s SP-1 point to a future where ZK technology is commodified and easily available without the need for directly handling the necessary cryptography.

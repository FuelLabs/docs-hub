# Fuel as a State Channel

## Defining State Channels

A state channel is a smart contract that enforces off-chain transactions between predefined parties. Each transaction updates the state of the chain and is cryptographically provable on-chain.

Check out [this resource to learn more about state channels.](https://ethereum.org/en/developers/docs/scaling/state-channels/)

## Fuel as a State Channel

The FuelVM is a priced virtual machine architecture with a deterministic state system, which makes it perfect for multi-party channel designs where all parties must have clarity over the exact state of the system at each communication step or window.

While we do not ship a channel configuration of the Fuel technology out of the box, the FuelVM is perfectly situated to handle this particular use case.
# Running a Fuel Sequencer Node or Validator

Below is a summary of key information to help you get started with running a node for the Fuel Sequencer blockchain.

For more details, please refer to the deployment [repository](https://github.com/FuelLabs/fuel-sequencer-deployments/).

## Hardware Requirements

| Hardware   | Minimum  | Recommended |
|------------|---------|-------------|
| Processor  | 4 Cores | 8 Cores     |
| Memory     | 8 GB    | 16 GB       |
| Storage    | 200 GB  | 1 TB        |

## Port Configuration

Unless otherwise configured, the following ports should be available:

- **Sequencer**: 26656, 26657, 9090, 1317  
- **Sidecar**: 8080  
- **Ethereum**: 8545, 8546  

These components interact with each other, so any changes to the port configuration must be reflected in the corresponding components. Specifically:

- Changes to **Sequencer ports** must be updated in the **Sidecar's runtime flags**.
- Changes to the **Sidecar port** must be updated in the **Sequencer's app config**.
- Changes to **Ethereum ports** must be updated in the **Sidecar's runtime flags**.

## Getting Started

Depending on your needs, you can choose one of the following setups:

1. **[Running a Mainnet Fuel Sequencer Node](./mainnet-node.md):** Your local node will connect to and sync with the mainnet Fuel Sequencer network.
2. **[Running a Mainnet Fuel Sequencer Validator](./mainnet-validator.md):** Your local node will connect to, sync with, and validate transactions on the mainnet Fuel Sequencer network.
3. **[Running a Testnet Fuel Sequencer Node](./testnet-node.md):** Your local node will connect to and sync with the testnet Fuel Sequencer network.
4. **[Running a Testnet Fuel Sequencer Validator](./testnet-validator.md):** Your local node will connect to, sync with, and validate transactions on the testnet Fuel Sequencer network.

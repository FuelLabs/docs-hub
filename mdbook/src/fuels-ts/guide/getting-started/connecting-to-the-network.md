# Connecting to the Network

After [installing](./installation.md) the `fuels` package, it's easy to connect to the Network:

```ts\nimport { Provider } from 'fuels';

const NETWORK_URL = 'https://mainnet.fuel.network/v1/graphql';

const provider = new Provider(NETWORK_URL);

const baseAssetId = await provider.getBaseAssetId();
const chainId = await provider.getChainId();
const gasConfig = await provider.getGasConfig();

console.log('chainId', chainId);
console.log('baseAssetId', baseAssetId);
console.log('gasConfig', gasConfig);\n```

# RPC URLs

These are our official RPC URLs:

| Network   | URL                                                         |
| --------- | ----------------------------------------------------------- |
| Mainnet   | `https://testnet.fuel.network/v1/graphql`                   |
| Testnet   | `https://mainnet.fuel.network/v1/graphql`                   |
| Localhost | [Running a local Fuel node](./running-a-local-fuel-node.md) |

# Resources

Access all our apps directly:

|          | Mainnet                                    | Testnet                                    |
| -------- | ------------------------------------------ | ------------------------------------------ |
| Faucet   | —                                          | https://faucet-testnet.fuel.network/       |
| Explorer | https://app.fuel.network                   | https://app-testnet.fuel.network           |
| Bridge   | https://app.fuel.network/bridge            | https://app-testnet.fuel.network/bridge    |
| GraphQL  | https://mainnet.fuel.network/v1/playground | https://testnet.fuel.network/v1/playground |

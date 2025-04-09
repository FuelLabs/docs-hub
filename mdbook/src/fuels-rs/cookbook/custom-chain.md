# Custom chain

This example demonstrates how to start a short-lived Fuel node with custom consensus parameters for the underlying chain.

First, we have to import `ConsensusParameters` and `ChainConfig`:

```rust,ignore
use fuels::{
            prelude::*,
            tx::{ConsensusParameters, FeeParameters, TxParameters},
        };
```

Next, we can define some values for the consensus parameters:

```rust,ignore
let tx_params = TxParameters::default()
            .with_max_gas_per_tx(1_000)
            .with_max_inputs(2);
        let fee_params = FeeParameters::default().with_gas_price_factor(10);

        let mut consensus_parameters = ConsensusParameters::default();
        consensus_parameters.set_tx_params(tx_params);
        consensus_parameters.set_fee_params(fee_params);

        let chain_config = ChainConfig {
            consensus_parameters,
            ..ChainConfig::default()
        };
```

Before we can start a node, we probably also want to define some genesis coins and assign them to an address:

```rust,ignore
let wallet = WalletUnlocked::new_random(None);
        let coins = setup_single_asset_coins(
            wallet.address(),
            Default::default(),
            DEFAULT_NUM_COINS,
            DEFAULT_COIN_AMOUNT,
        );
```

Finally, we call `setup_test_provider()`, which starts a node with the given configurations and returns a
provider attached to that node:

```rust,ignore
let node_config = NodeConfig::default();
        let _provider =
            setup_test_provider(coins, vec![], Some(node_config), Some(chain_config)).await?;
```

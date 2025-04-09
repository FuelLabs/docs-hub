# Running a short-lived Fuel node with the SDK

You can use the SDK to spin up a local, ideally short-lived Fuel node. Then, you can instantiate a Fuel client, pointing to this node.

```rust,ignore
use fuels::prelude::{FuelService, Provider};

        // Run the fuel node.
        let server = FuelService::start(
            NodeConfig::default(),
            ChainConfig::default(),
            StateConfig::default(),
        )
        .await?;

        // Create a client that will talk to the node created above.
        let client = Provider::from(server.bound_address()).await?;
        assert!(client.healthy().await?);
```

This approach is ideal for contract testing.

You can also use the test helper `setup_test_provider()` for this:

```rust,ignore
use fuels::prelude::*;

        // Use the test helper to setup a test provider.
        let provider = setup_test_provider(vec![], vec![], None, None).await?;

        // Create the wallet.
        let _wallet = WalletUnlocked::new_random(Some(provider));
```

You can also use `launch_provider_and_get_wallet()`, which abstracts away the `setup_test_provider()` and the wallet creation, all in one single method:

```rust,ignore
let wallet = launch_provider_and_get_wallet().await?;
```

## Features

### Fuel-core lib

The `fuel-core-lib` feature allows us to run a `fuel-core` node without installing the `fuel-core` binary on the local machine. Using the `fuel-core-lib` feature flag entails downloading all the dependencies needed to run the fuel-core node.

```rust,ignore
fuels = { version = "0.70.1", features = ["fuel-core-lib"] }
```

### RocksDB

The `rocksdb` is an additional feature that, when combined with `fuel-core-lib`, provides persistent storage capabilities while using `fuel-core` as a library.

```rust,ignore
fuels = { version = "0.70.1", features = ["rocksdb"] }
```

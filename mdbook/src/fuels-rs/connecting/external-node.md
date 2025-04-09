# Connecting to the Testnet or an external node

We can interact with the `Testnet` node by using the following example.

```rust,ignore
use std::str::FromStr;

        use fuels::{crypto::SecretKey, prelude::*};

        // Create a provider pointing to the testnet.
        let provider = Provider::connect("testnet.fuel.network").await.unwrap();

        // Setup a private key
        let secret = SecretKey::from_str(
            "a1447cd75accc6b71a976fd3401a1f6ce318d27ba660b0315ee6ac347bf39568",
        )?;

        // Create the wallet
        let wallet = WalletUnlocked::new_from_private_key(secret, Some(provider));

        // Get the wallet address. Used later with the faucet
        dbg!(wallet.address().to_string());
```
>
> For detailed information about various testnet networks and their optimal toolchain configurations for your project, please visit the following link:
>
> [networks](https://fuelbook.fuel.network/master/networks/networks.html)

In the code example, we connected a new provider to the Testnet node and created a new wallet from a private key.

> **Note:** New wallets on the Testnet will not have any assets! They can be obtained by providing the wallet address to the faucet at
>
>[faucet-testnet.fuel.network](https://faucet-testnet.fuel.network)
>
> Once the assets have been transferred to the wallet, you can reuse it in other tests by providing the private key!
>
> In addition to the faucet, there is a block explorer for the Testnet at
>
> [block-explorer](https://fuellabs.github.io/block-explorer-v2)

If you want to connect to another node just change the URL or IP and port. For example, to connect to a local node that was created with `fuel-core` you can use:

```rust,ignore
let _provider = Provider::connect(format!("127.0.0.1:{port}")).await?;
```
